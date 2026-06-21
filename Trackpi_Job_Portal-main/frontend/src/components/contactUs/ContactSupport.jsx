import React from "react";
import { HelpCircle, FileText, Briefcase, Mic2, ChevronRight } from "lucide-react";

const ContactSupport = () => {
    return (
        <section className="bg-[#FFFDF5] py-20 px-6 md:px-12 border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto text-center space-y-10">
                <h2 className="text-3xl font-bold">FAQ / Support</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FFF8E1] p-6 rounded-xl flex items-center justify-between hover:bg-[#ffeec2] cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-[#FFB300] shadow-sm"><HelpCircle size={24} /></div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900">Help Center</h4>
                                <p className="text-sm text-gray-500">Get quick help & FAQs</p>
                            </div>
                        </div>
                        <ChevronRight className="text-black-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="bg-[#FFF8E1] p-6 rounded-xl flex items-center justify-between hover:bg-[#ffeec2] cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-[#FFB300] shadow-sm"><FileText size={24} /></div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900">Guidelines</h4>
                                <p className="text-sm text-gray-500">Learn our community policies</p>
                            </div>
                        </div>
                        <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="bg-[#FFF8E1] p-6 rounded-xl flex items-center justify-between hover:bg-[#ffeec2] cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-[#FFB300] shadow-sm"><Briefcase size={24} /></div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900">Careers</h4>
                                <p className="text-sm text-gray-500">Explore current openings</p>
                            </div>
                        </div>
                        <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="bg-[#FFF8E1] p-6 rounded-xl flex items-center justify-between hover:bg-[#ffeec2] cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-[#FFB300] shadow-sm"><Mic2 size={24} /></div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900">Press</h4>
                                <p className="text-sm text-gray-500">Reach our media team</p>
                            </div>
                        </div>
                        <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSupport;
