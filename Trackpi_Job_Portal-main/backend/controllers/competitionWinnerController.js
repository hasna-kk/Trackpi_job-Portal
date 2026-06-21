import mongoose from "mongoose";
import CompetitionWinner from "../models/CompetitionWinner.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CLOUDINARY UPLOAD ================= */

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
          originalName: file.originalname
        });
      }
    );
    uploadStream.end(file.buffer);
  });
};

/* ================= CREATE ================= */

export const createWinner = async (req, res) => {
  try {
    const { name, department, about, isActive = true } = req.body;

    if (!name || !department || !about) {
      return res.status(400).json({
        success: false,
        message: "Name, department, and about are required"
      });
    }

    let image = {};
    if (req.file) {
      image = await uploadToCloudinary(
        req.file,
        "competition_winners/images"
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Winner image is required"
      });
    }

    const winner = await CompetitionWinner.create({
      name: name.trim(),
      department: department.trim(),
      about: about.trim(),
      image,
      isActive
    });

    res.status(201).json({
      success: true,
      data: winner,
      message: "Competition winner created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error creating competition winner"
    });
  }
};

/* ================= UPDATE ================= */

export const updateWinner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid winner ID"
      });
    }

    const winner = await CompetitionWinner.findById(id);
    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found"
      });
    }

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.department) updateData.department = req.body.department.trim();
    if (req.body.about) updateData.about = req.body.about.trim();
    if (req.body.isActive !== undefined)
      updateData.isActive = req.body.isActive;

    if (req.file) {
      if (winner.image?.public_id) {
        await cloudinary.uploader.destroy(
          winner.image.public_id,
          { resource_type: "image" }
        );
      }
      updateData.image = await uploadToCloudinary(
        req.file,
        "competition_winners/images"
      );
    }

    const updated = await CompetitionWinner.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated,
      message: "Competition winner updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error updating competition winner"
    });
  }
};

/* ================= DELETE ================= */

export const deleteWinner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid winner ID"
      });
    }

    const winner = await CompetitionWinner.findById(id);
    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found"
      });
    }

    if (winner.image?.public_id) {
      await cloudinary.uploader.destroy(
        winner.image.public_id,
        { resource_type: "image" }
      );
    }

    await CompetitionWinner.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Competition winner deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error deleting competition winner"
    });
  }
};

/* ================= ADMIN LIST ================= */

export const getAdminWinners = async (req, res) => {
  try {
    const winners = await CompetitionWinner.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: winners
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching competition winners"
    });
  }
};

/* ================= PUBLIC LIST ================= */

export const getPublicWinners = async (req, res) => {
  try {
    const winners = await CompetitionWinner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: winners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching competition winners"
    });
  }
};

/* ================= GET SINGLE ================= */

export const getWinnerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid winner ID"
      });
    }

    const winner = await CompetitionWinner.findById(id);
    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found"
      });
    }

    res.json({
      success: true,
      data: winner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching competition winner"
    });
  }
};
