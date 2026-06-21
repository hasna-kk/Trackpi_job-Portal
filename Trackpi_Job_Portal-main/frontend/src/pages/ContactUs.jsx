import React from "react";
import Navbar from "../components/Navbar";
import HeroContactUs from "../components/contactUs/HeroContactUs";
import Footer from "../components/Footer";
import ContactConnect from "../components/contactUs/ContactConnect";
import ContactForm from "../components/contactUs/ContactForm";
import ContactMap from "../components/contactUs/ContactMap";
import ContactSupport from "../components/contactUs/ContactSupport";

const ContactUs = () => {
    const formRef = React.useRef(null);
    const connectRef = React.useRef(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToConnect = () => {
        connectRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full bg-white font-cabinet">
            <Navbar mode="public" />
            {/* 1. Hero Section */}
            <HeroContactUs
                onSendMessageClick={scrollToForm}
                onContactDetailsClick={scrollToConnect}
            />

            {/* 2. Connect Us Section (Yellow) */}
            <div ref={connectRef}>
                <ContactConnect />
            </div>

            {/* 3. Main Content: Form & Map */}
            <section ref={formRef} className="w-full py-20 px-6 md:px-12 bg-[#F9FAFB]">
                <div className="max-w-[1400px] mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-black">
                            Reach out to <span className="text-[#FFB300]">us</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            We're here to help! Fill in the form and our team will get back to you soon.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form Section */}
                        <ContactForm />

                        {/* Map Section */}
                        <ContactMap />
                    </div>
                </div>
            </section>

            {/* 4. Support Links Section */}
            <ContactSupport />

            <Footer />
        </div>
    );
};

export default ContactUs;
