import mongoose from "mongoose";
import Testimonial from "../models/Testimonial.js";
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

export const createTestimonial = async (req, res) => {
  try {
    const { name, jobTitle, about, isActive = true } = req.body;

    if (!name || !jobTitle || !about) {
      return res.status(400).json({
        success: false,
        message: "Name, job title and about are required"
      });
    }

    if (
      !req.files?.coverImage?.[0] ||
      !req.files?.thumbnailImage?.[0] ||
      !req.files?.video?.[0]
    ) {
      return res.status(400).json({
        success: false,
        message: "Cover image, thumbnail image and video are required"
      });
    }

    const coverImage = await uploadToCloudinary(
      req.files.coverImage[0],
      "testimonials/cover"
    );

    const thumbnailImage = await uploadToCloudinary(
      req.files.thumbnailImage[0],
      "testimonials/thumbnail"
    );

    const video = await uploadToCloudinary(
      req.files.video[0],
      "testimonials/videos"
    );

    const testimonial = await Testimonial.create({
      name: name.trim(),
      jobTitle: jobTitle.trim(),
      about: about.trim(),
      coverImage,
      thumbnailImage,
      video,
      isActive
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: "Testimonial created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error creating testimonial"
    });
  }
};

/* ================= UPDATE ================= */

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.jobTitle) updateData.jobTitle = req.body.jobTitle.trim();
    if (req.body.about) updateData.about = req.body.about.trim();
    if (req.body.isActive !== undefined)
      updateData.isActive = req.body.isActive;

    if (req.files?.coverImage?.[0]) {
      if (testimonial.coverImage?.public_id) {
        await cloudinary.uploader.destroy(
          testimonial.coverImage.public_id,
          { resource_type: "image" }
        );
      }
      updateData.coverImage = await uploadToCloudinary(
        req.files.coverImage[0],
        "testimonials/cover"
      );
    }

    if (req.files?.thumbnailImage?.[0]) {
      if (testimonial.thumbnailImage?.public_id) {
        await cloudinary.uploader.destroy(
          testimonial.thumbnailImage.public_id,
          { resource_type: "image" }
        );
      }
      updateData.thumbnailImage = await uploadToCloudinary(
        req.files.thumbnailImage[0],
        "testimonials/thumbnail"
      );
    }

    if (req.files?.video?.[0]) {
      if (testimonial.video?.public_id) {
        await cloudinary.uploader.destroy(
          testimonial.video.public_id,
          { resource_type: "video" }
        );
      }
      updateData.video = await uploadToCloudinary(
        req.files.video[0],
        "testimonials/videos"
      );
    }

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated,
      message: "Testimonial updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error updating testimonial"
    });
  }
};

/* ================= DELETE ================= */

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    if (testimonial.coverImage?.public_id) {
      await cloudinary.uploader.destroy(
        testimonial.coverImage.public_id,
        { resource_type: "image" }
      );
    }

    if (testimonial.thumbnailImage?.public_id) {
      await cloudinary.uploader.destroy(
        testimonial.thumbnailImage.public_id,
        { resource_type: "image" }
      );
    }

    if (testimonial.video?.public_id) {
      await cloudinary.uploader.destroy(
        testimonial.video.public_id,
        { resource_type: "video" }
      );
    }

    await Testimonial.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error deleting testimonial"
    });
  }
};

/* ================= ADMIN LIST ================= */

/* ================= ADMIN LIST WITH PAGINATION ================= */

export const getAdminTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const skip = (page - 1) * limit;

    const total = await Testimonial.countDocuments();

    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching testimonials"
    });
  }
};

/* ================= PUBLIC LIST ================= */

export const getPublicTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const total = await Testimonial.countDocuments({ isActive: true });
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error fetching testimonials"
    });
  }
};

/* ================= GET SINGLE ================= */

export const getAdminTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CRITICAL FIX
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching testimonial"
    });
  }
};
