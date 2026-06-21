import Contact from "../models/Contact.js";

// @desc    Submit a new contact form
// @route   POST /api/contact/submit
// @access  Public
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, location, hearAboutUs, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            location,
            hearAboutUs,
            message
        });

        await newContact.save();

        res.status(201).json({ message: "Message sent successfully!", contact: newContact });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Server Error. Please try again later." });
    }
};

// @desc    Get all contact form submissions
// @route   GET /api/contact/all
// @access  Private (Admin/SuperAdmin)
export const getAllContactForms = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contact forms:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get single contact form by ID
// @route   GET /api/contact/:id
// @access  Private (Admin/SuperAdmin)
export const getContactFormById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact form not found" });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error("Error fetching contact form:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
