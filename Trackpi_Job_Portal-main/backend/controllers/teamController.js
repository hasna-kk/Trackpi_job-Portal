import mongoose from "mongoose";
import Team from "../models/Team.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    );
    uploadStream.end(file.buffer);
  });
};

/* ================= CREATE ================= */
export const createTeamMember = async (req, res) => {
  try {
    const { name, designation, facebook, twitter, linkedin, order, isActive } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ success: false, message: "Name and designation are required" });
    }

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file, "team");
    }

    const member = await Team.create({
      name: name.trim(),
      designation: designation.trim(),
      image,
      socialLinks: { facebook, twitter, linkedin },
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, data: member, message: "Team member created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error creating team member" });
  }
};

/* ================= UPDATE ================= */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findById(id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });

    const updateData = { ...req.body };
    if (req.body.facebook !== undefined || req.body.twitter !== undefined || req.body.linkedin !== undefined) {
      updateData.socialLinks = {
        facebook: req.body.facebook || member.socialLinks.facebook,
        twitter: req.body.twitter || member.socialLinks.twitter,
        linkedin: req.body.linkedin || member.socialLinks.linkedin
      };
    }

    if (req.file) {
      if (member.image?.public_id) {
        await cloudinary.uploader.destroy(member.image.public_id);
      }
      updateData.image = await uploadToCloudinary(req.file, "team");
    }

    const updated = await Team.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, data: updated, message: "Team member updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating team member" });
  }
};

/* ================= DELETE ================= */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findById(id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });

    if (member.image?.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await Team.findByIdAndDelete(id);
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error deleting member" });
  }
};

/* ================= GET ALL (ADMIN) ================= */
export const getAdminTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1 });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching team" });
  }
};

/* ================= GET ALL (PUBLIC) ================= */
export const getPublicTeam = async (req, res) => {
  try {
    const team = await Team.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching team" });
  }
};

/* ================= GET BY ID ================= */
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
