import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import HiringPartners from "../models/HiringPartners.js";

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
          originalName: file.originalname,
        });
      }
    );
    uploadStream.end(file.buffer);
  });
};

/* ================= CREATE ================= */

export const createHiringPartners = async (req, res) => {
  try {
    const { organizationname, email, aboutcompany, isActive = true } = req.body;

    if (!organizationname || !email || !aboutcompany) {
      return res.status(400).json({
        success: false,
        message: "organizationname, email and aboutcompany are required",
      });
    }

    if (!req.files?.logo?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Logo is required",
      });
    }

    const logo = await uploadToCloudinary(
      req.files.logo[0],
      "hiringpartners/logo"
    );

    const hiringpartner = await HiringPartners.create({
      organizationname: organizationname.trim(),
      email: email.trim(),
      aboutcompany: aboutcompany.trim(),
      logo,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: hiringpartner,
      message: "Hiring Partner created successfully",
    });
  } catch (error) {
    console.error("Create Hiring Partner Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating hiring partner",
    });
  }
};

/* ================= UPDATE ================= */

export const updateHiringPartners = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hiring partner ID",
      });
    }

    const hiringpartner = await HiringPartners.findById(id);
    if (!hiringpartner) {
      return res.status(404).json({
        success: false,
        message: "Hiring partner not found",
      });
    }

    const updateData = {};

    if (req.body.organizationname)
      updateData.organizationname = req.body.organizationname.trim();

    if (req.body.email)
      updateData.email = req.body.email.trim();

    if (req.body.aboutcompany)
      updateData.aboutcompany = req.body.aboutcompany.trim();

    if (req.body.isActive !== undefined)
      updateData.isActive = req.body.isActive;

    // Update Logo
    if (req.files?.logo?.[0]) {
      if (hiringpartner.logo?.public_id) {
        await cloudinary.uploader.destroy(
          hiringpartner.logo.public_id,
          { resource_type: "image" }
        );
      }

      updateData.logo = await uploadToCloudinary(
        req.files.logo[0],
        "hiringpartners/logo"
      );
    }

    const updated = await HiringPartners.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated,
      message: "Hiring partner updated successfully",
    });
  } catch (error) {
    console.error("Update Hiring Partner Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating hiring partner",
    });
  }
};

/* ================= DELETE ================= */

export const deleteHiringPartners = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hiring partner ID",
      });
    }

    const hiringpartner = await HiringPartners.findById(id);
    if (!hiringpartner) {
      return res.status(404).json({
        success: false,
        message: "Hiring partner not found",
      });
    }

    // Delete logo from Cloudinary
    if (hiringpartner.logo?.public_id) {
      await cloudinary.uploader.destroy(
        hiringpartner.logo.public_id,
        { resource_type: "image" }
      );
    }

    await HiringPartners.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Hiring partner deleted successfully",
    });
  } catch (error) {
    console.error("Delete Hiring Partner Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting hiring partner",
    });
  }
};

/* ================= ADMIN LIST WITH PAGINATION ================= */

export const getAdminHiringPartners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const total = await HiringPartners.countDocuments();

    const hiringpartners = await HiringPartners.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: hiringpartners,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Admin List Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching hiring partners",
    });
  }
};

/* ================= PUBLIC LIST ================= */

export const getPublicHiringPartners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await HiringPartners.countDocuments({ isActive: true });

    const partners = await HiringPartners.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: partners,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching partners",
    });
  }
};


/* ================= GET SINGLE ================= */

export const getAdminHiringPartnersById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hiring partner ID",
      });
    }

    const hiringpartner = await HiringPartners.findById(id);

    if (!hiringpartner) {
      return res.status(404).json({
        success: false,
        message: "Hiring partner not found",
      });
    }

    res.json({
      success: true,
      data: hiringpartner,
    });
  } catch (error) {
    console.error("Get By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching hiring partner",
    });
  }
};
