import React from "react";
import { MapPin } from "lucide-react";

const ContactMap = () => {
    return (
        <div className="space-y-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold">Find <span className="text-[#FFB300]">Our</span> Office</h3>
            <div className="w-full flex-1 min-h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.129704874187!2d76.34295681021048!3d10.006143490058276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d46d39054eb%3A0x816e390a5fb8dc8a!2sTrackpi%20Private%20Limited!5e0!3m2!1sen!2sin!4v1770378088083!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TrackPi Location (BCG Tower)"
                ></iframe>

                {/* Location Marker Overlay (Simulated styling from design) */}

            </div>
        </div>
    );
};

export default ContactMap;
