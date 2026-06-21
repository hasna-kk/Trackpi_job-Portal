import React from "react";
import heroImage from "../../assets/hero/cuate.png"; // Placeholder, user can replace with specific contact illustration

const HeroContactUs = ({ onSendMessageClick, onContactDetailsClick }) => {
    return (
        <section className="relative w-full bg-white pt-24 pb-16 lg:pt-32 lg:pb-12 px-6 md:px-12 font-cabinet">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side - Text Content */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Optional: Add a small icon or badge if needed, strictly following clean design */}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                        Get in Touch <span className="text-[#FFB300]">With Us</span>
                    </h1>

                    <p className="text-gray-600 text-lg max-w-lg leading-relaxed font-['Montserrat']">
                        Have questions, feedback, or partnership ideas? We'd love to hear from
                        you. Fill the form or reach us through the contact details below.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={onSendMessageClick}
                            className="bg-[#FFB300] hover:bg-[#ffca2c] text-black font-bold py-3.5 px-8 rounded-full shadow-md transition-all transform active:scale-95"
                        >
                            Send a Message
                        </button>
                        <button
                            onClick={onContactDetailsClick}
                            className="bg-white border-2 border-black text-black font-bold py-3.5 px-8 rounded-full hover:bg-black hover:text-white transition-all transform active:scale-95"
                        >
                            Contact Details
                        </button>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="relative flex justify-center lg:justify-end">
                    {/* 
                NOTE: The design uses a specific illustration (Man with headset). 
                Since I don't have that specific asset, I'm using a placeholder logic here.
                The user can import the correct image as 'contact-hero.png' or similar.
             */}
                    <div className="relative z-10 w-full max-w-lg">
                        <img
                            src={heroImage}
                            alt="Customer Support"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Background Decor Elements (Abstract based on design) */}
                    <div className="absolute top-0 right-10 w-20 h-20 bg-gray-100 rounded-full blur-xl -z-10"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#FFB300]/10 rounded-full blur-2xl -z-10"></div>
                </div>

            </div>
        </section>
    );
};

export default HeroContactUs;