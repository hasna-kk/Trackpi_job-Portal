import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactConnect = () => {
    return (
        <section className="relative w-full bg-white py-16 px-6 md:px-12 font-cabinet">
            <div className="max-w-[1200px] mx-auto text-center space-y-10">

                {/* Title Outside */}
                <h2 className="text-4xl md:text-5xl font-bold text-black">
                    Connect <span className="text-[#FFB300]">Us</span>
                </h2>

                {/* Yellow Container with Custom Shape (Similar to Stats) */}
                <div
                    className="relative w-full bg-[#FFB300] py-16 px-6 md:px-12 rounded-tr-[50px] rounded-bl-[50px]"
                    style={{
                        clipPath: "polygon(50px 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 50px)"
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Visit Us */}
                        <div className="bg-[#FFFDF5] rounded-l-full rounded-tr-2xl rounded-br-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="bg-white p-3 rounded-full text-[#FFB300] shadow-sm flex-shrink-0">
                                <MapPin size={28} className="text-[#FFB300]" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-black">Visit Us</h3>
                                <p className="text-gray-600 text-sm leading-tight">Kakkanad, Kochi, Kerala</p>
                            </div>
                        </div>

                        {/* Card 2: Email Us */}
                        <div className="bg-[#FFFDF5] rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="bg-white p-3 rounded-full text-[#FFB300] shadow-sm flex-shrink-0">
                                <Mail size={28} className="text-[#FFB300]" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-black">Email Us</h3>
                                <p className="text-gray-600 text-sm leading-tight">hello@trackpi.in</p>
                            </div>
                        </div>

                        {/* Card 3: Call Us */}
                        <div className="bg-[#FFFDF5] rounded-r-full rounded-tl-2xl rounded-bl-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="bg-white p-3 rounded-full text-[#FFB300] shadow-sm flex-shrink-0">
                                <Phone size={28} className="text-[#FFB300]" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-black">Call Us</h3>
                                <p className="text-gray-600 text-sm leading-tight">+91 12345 67890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactConnect;
