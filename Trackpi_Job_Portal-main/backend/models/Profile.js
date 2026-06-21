import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // ================= BASIC INFO =================
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        alternatePhone: {
            type: String,
            trim: true,
            default: "",
        },

        email: {
            type: String,
            trim: true,
        },

        summary: {
            type: String,
            trim: true,
            default: "",
        },

        // Location Details
        location: {
            pincode: { type: String, default: "" },
            country: { type: String, default: "" },
            state: { type: String, default: "" },
            city: { type: String, default: "" },
        },

        permanentLocation: {
            pincode: { type: String, default: "" },
            country: { type: String, default: "" },
            state: { type: String, default: "" },
            city: { type: String, default: "" },
        },

        dateOfBirth: {
            type: String, // or Date
            default: "",
        },

        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: "",
        },

        maritalStatus: {
            type: String,
            enum: ["married", "single", ""],
            default: "",
        },

        // ================= CAREER INFO =================
        workStatus: {
            type: String,
            enum: ["fresher", "experienced", ""],
            default: "",
        },

        // Only if experienced
        workExperience: [
            {
                jobTitle: String,
                company: String,
                startDate: String,
                endDate: String,
                description: String,
                employmentType: { type: String, default: "" },
                location: { type: String, default: "" },
                salary: { type: String, default: "" }, // Added
                workMode: { type: String, enum: ["onsite", "remote", "hybrid", ""], default: "" }, // Added
                currentlyWorking: { type: Boolean, default: false }
            }
        ],

        // ================= STEP 2: PROFESSIONAL INFO =================
        languages: [{
            name: { type: String, required: true },
            proficiency: { type: String, default: "beginner" }, // beginner, intermediate, expert
            canRead: { type: Boolean, default: false },
            canWrite: { type: Boolean, default: false },
            canSpeak: { type: Boolean, default: false }
        }],

        preferredLocations: [{ type: String }],

        willRelocate: {
            type: Boolean,
            default: false
        },

        preferredWorkMode: {
            type: String,
            enum: ["onsite", "remote", "hybrid", "field", ""],
            default: ""
        },

        education: [{
            degree: String,
            institution: String,
            course: String, // e.g. "Computer Science"
            courseType: String, // "Full time", "Part time", etc.
            startDate: String, // Year
            endDate: String, // Year
            grade: String, // "A"
            domain: String, // University domain for logo
            year: String, // Legacy, kept for compatibility if needed, or derived
            description: String
        }],

        // ================= STEP 3: EXPERIENCE & ASSETS =================
        expectedSalary: { type: String, default: "" },

        // Legacy fields kept for safety, but Step 2 uses the above now
        jobTitle: { type: String, default: "" },
        skills: [{
            name: { type: String, required: true },
            isStarred: { type: Boolean, default: false }
        }],

        // ================= ASSETS =================
        resumeUrl: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: ""
        },
        coverImage: {
            type: String,
            default: ""
        },

        // ================= EXTRA =================
        hasDrivingLicense: { type: Boolean, default: false },
        hasTwoWheeler: { type: Boolean, default: false },
        hasLaptop: { type: Boolean, default: false },

        careerBreak: { type: Boolean, default: false },
        careerBreakDuration: { type: String, default: "" },

        // ================= SOCIAL =================
        socialLinks: {
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            behance: { type: String, default: "" },
            facebook: { type: String, default: "" },
            portfolio: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },

        // Driving License (Multiple selection possible)
        drivingLicenses: [{ type: String }], // "two_wheeler", "four_wheeler"

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    { 
        timestamps: true,
        // Normalization is now handled by Profile schema transforms (toJSON/toObject)
        toJSON: {
            transform: function(doc, ret) {
                if (ret.skills && Array.isArray(ret.skills)) {
                    ret.skills = ret.skills.map(skill => {
                        if (typeof skill === 'string') return { name: skill, isStarred: false };
                        return skill;
                    });
                }
                return ret;
            }
        },
        toObject: {
            transform: function(doc, ret) {
                if (ret.skills && Array.isArray(ret.skills)) {
                    ret.skills = ret.skills.map(skill => {
                        if (typeof skill === 'string') return { name: skill, isStarred: false };
                        return skill;
                    });
                }
                return ret;
            }
        }
    }
);

export default mongoose.model("Profile", profileSchema);
