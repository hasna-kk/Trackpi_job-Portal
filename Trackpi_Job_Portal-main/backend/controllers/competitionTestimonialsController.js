import mongoose from "mongoose";
import CompetitionTestimonial from "../models/CompetitionTestimonial.js";
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

export const createCompetitionTestimonial = async (req, res) => {
  try {
    const { name, jobTitle, about, rating, isActive = true } = req.body;

    if (!name || !jobTitle || !about || !rating) {
      return res.status(400).json({
        success: false,
        message: "Name, job title, about and rating are required"
      });
    }

    if (
      !req.files?.coverImage?.[0] ||
      !req.files?.video?.[0]
    ) {
      return res.status(400).json({
        success: false,
        message: "Cover image and video are required"
      });
    }

    const coverImage = await uploadToCloudinary(
      req.files.coverImage[0],
      "competition_testimonials/cover"
    );

    const video = await uploadToCloudinary(
      req.files.video[0],
      "competition_testimonials/videos"
    );

    const testimonial = await CompetitionTestimonial.create({
      name: name.trim(),
      jobTitle: jobTitle.trim(),
      about: about.trim(),
      rating: Number(rating),
      coverImage,
      video,
      isActive
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: "Competition testimonial created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error creating competition testimonial"
    });
  }
};

/* ================= UPDATE ================= */

export const updateCompetitionTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await CompetitionTestimonial.findById(id);
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
    if (req.body.rating) updateData.rating = Number(req.body.rating);
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
        "competition_testimonials/cover"
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
        "competition_testimonials/videos"
      );
    }

    const updated = await CompetitionTestimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated,
      message: "Competition testimonial updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error updating competition testimonial"
    });
  }
};

/* ================= DELETE ================= */

export const deleteCompetitionTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await CompetitionTestimonial.findById(id);
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

    if (testimonial.video?.public_id) {
      await cloudinary.uploader.destroy(
        testimonial.video.public_id,
        { resource_type: "video" }
      );
    }

    await CompetitionTestimonial.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Competition testimonial deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error deleting competition testimonial"
    });
  }
};

/* ================= ADMIN LIST ================= */

export const getAdminCompetitionTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await CompetitionTestimonial.countDocuments();
    const testimonials = await CompetitionTestimonial.find()
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
      message: "Server error fetching competition testimonials"
    });
  }
};

/* ================= PUBLIC LIST ================= */

export const getPublicCompetitionTestimonials = async (req, res) => {
  try {
    const testimonials = await CompetitionTestimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching competition testimonials"
    });
  }
};

/* ================= GET SINGLE ================= */

export const getCompetitionTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID"
      });
    }

    const testimonial = await CompetitionTestimonial.findById(id);
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
      message: "Server error fetching competition testimonial"
    });
  }
};
