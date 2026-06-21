import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import connectDB from "./config/db.js";

import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resumeAdminRoutes from "./routes/resumeAdminRoutes.js";
import resumeBuildRoutes from "./routes/resumeBuildRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import testimonialsRoutes from "./routes/testimonialsRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import hiringpartnersRoutes from "./routes/hiringpartnersRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import competitionTestimonialsRoutes from "./routes/competitionTestimonialsRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import competitionWinnerRoutes from "./routes/competitionWinnerRoutes.js";

const app = express();

// Connect database
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Sanitization (Note: Disabled due to incompatibility with Express 5 read-only req.query)
// app.use(mongoSanitize());
// app.use(xss());



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeBuildRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/resume-candidates", resumeAdminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/competition-testimonials", competitionTestimonialsRoutes);
app.use("/api/competition-winners", competitionWinnerRoutes);
app.use("/api/videos", videoRoutes);

// Generic route groups
app.use("/api", testimonialsRoutes);
app.use("/api", hiringpartnersRoutes);
app.use("/api", teamRoutes);

// Health route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch-all:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});