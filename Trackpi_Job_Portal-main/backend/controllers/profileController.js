import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ✅ Create or Update Profile
// ✅ Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware
        const { isFinalSubmission, ...bodyData } = req.body;

        // 1. Safety Whitelist
        const allowedFields = [
            'fullName', 'jobTitle', 'phone', 'altPhone', 'alternatePhone', 'email',
            'country', 'state', 'city', 'pincode', 'location', // Added location object and flattened fields
            'dob', 'dateOfBirth', 'gender', 'maritalStatus', 'workStatus',
            'education', 'workExperience', // Arrays
            'skills', 'languages',
            'preferredLocations', 'willRelocate', 'preferredWorkMode', // Step 2 fields
            'expectedSalary', 'drivingLicenses', 'hasTwoWheeler', 'hasLaptop', 'socialLinks',
            'resumeUrl', 'profileImage', 'summary',
            'careerBreak', 'careerBreakDuration' // Added whitelist
        ];

        // Filter bodyData to only allowed fields
        const safeUpdates = {};
        Object.keys(bodyData).forEach(key => {
            if (allowedFields.includes(key)) {
                safeUpdates[key] = bodyData[key];
            }
        });

        // Map 'dob' to 'dateOfBirth' if needed
        if (safeUpdates.dob && !safeUpdates.dateOfBirth) {
            safeUpdates.dateOfBirth = safeUpdates.dob;
        }
        delete safeUpdates.dob;

        // Map 'altPhone' to 'alternatePhone'
        if (safeUpdates.altPhone !== undefined) {
            if (safeUpdates.alternatePhone === undefined) {
                safeUpdates.alternatePhone = safeUpdates.altPhone;
            }
            delete safeUpdates.altPhone;
        }

        // Handle Location Mapping (Flat -> Nested)
        // If flat fields exist, merge them into location object
        if (bodyData.country || bodyData.state || bodyData.city || bodyData.pincode) {
            safeUpdates.location = {
                ...safeUpdates.location, // Preserve specific location updates if any
                country: bodyData.country || safeUpdates.location?.country,
                state: bodyData.state || safeUpdates.location?.state,
                city: bodyData.city || safeUpdates.location?.city,
                pincode: bodyData.pincode || safeUpdates.location?.pincode
            };

            // Remove flat fields from root to avoid schema validation errors if strict is true
            delete safeUpdates.country;
            delete safeUpdates.state;
            delete safeUpdates.city;
            delete safeUpdates.pincode;
        }
        
        // 1.1 Support backward compatibility for skills (String array -> Object array)
        if (safeUpdates.skills && Array.isArray(safeUpdates.skills)) {
            safeUpdates.skills = safeUpdates.skills.map(skill => {
                if (typeof skill === 'string') {
                    return { name: skill, isStarred: false };
                }
                return skill;
            });
        }

        const profileFields = {
            user: userId,
            ...safeUpdates
        };

        // 2. Profile Completion Logic
        // Only set profileCompleted if this is a final submission
        if (isFinalSubmission) {
            profileFields.profileCompleted = true;
        }

        // Use findOneAndUpdate with upsert to handle both create and update
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Also update User model ONLY if final submission
        if (isFinalSubmission) {
            const userUpdates = { profileCompleted: true };
            if (bodyData.fullName) {
                userUpdates.name = bodyData.fullName;
            }
            // Sync Phone to User Model (Critical for OTP Login)
            if (bodyData.phone) {
                // Check if this phone is already taken by ANOTHER user
                const phoneExists = await User.findOne({ phone: bodyData.phone, _id: { $ne: userId } });
                if (phoneExists) {
                    return res.status(400).json({
                        success: false,
                        message: "This phone number is already associated with another account. Please use a different number or login with that account."
                    });
                }
                userUpdates.phone = bodyData.phone;
            }
            await User.findByIdAndUpdate(userId, userUpdates);
        }

        return res.status(200).json({
            success: true,
            message: "Profile saved successfully",
            profile,
        });

    } catch (error) {
        console.error("Profile create/update error:", error); // Keep original error log
        console.error("Validation Error Details:", JSON.stringify(error.errors, null, 2)); // Log validation errors
        console.error("Incoming Body:", JSON.stringify(req.body, null, 2)); // Log what was sent
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create or update profile", // Send actual error message to frontend
            error: error // Send full error object for debugging
        });
    }
};

// ✅ Get My Profile
export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const profile = await Profile.findOne({ user: userId }).populate(
            "user",
            "name email"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // Normalization is now handled by Profile schema transforms (toJSON/toObject)
        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};

// ✅ Check if my profile exists(optional helper)
export const checkProfileStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const profile = await Profile.findOne({ user: userId });

        res.status(200).json({
            success: true,
            hasProfile: !!profile,
            profileCompleted: profile?.profileCompleted || false,
            resumeUrl: profile?.resumeUrl || "",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to check profile status",
        });
    }
};

export const uploadCoverImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { coverImage: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Cover upload error:", error);
        res.status(500).json({ success: false, message: "Cover upload failed" });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { profileImage: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Profile image upload error:", error);
        res.status(500).json({ success: false, message: "Profile image upload failed" });
    }
};

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { resumeUrl: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Resume upload error:", error);
        res.status(500).json({ success: false, message: "Resume upload failed" });
    }
};


// ✅ Delete Cover Image
export const deleteCoverImage = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { coverImage: "" },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// ✅ Delete Profile Image
export const deleteProfileImage = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { profileImage: "" },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Delete Resume
export const deleteResume = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: { resumeUrl: "" }, $unset: { resume: 1 } },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json(profile);
    } catch (err) {
        console.error("Delete resume fatal error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};
