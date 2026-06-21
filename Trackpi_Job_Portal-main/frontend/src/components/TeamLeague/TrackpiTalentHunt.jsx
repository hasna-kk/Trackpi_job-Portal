import React from "react";
import talentHuntIllustration from "../../assets/illustrations/talent_hunt_illustration.png";

const TrackpiTalentHunt = () => {
    return (
        <section className="relative w-full pt-16 pb-20 bg-black overflow-hidden">


            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20">

                {/* Section Heading */}
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12 text-center font-russo">
                    <span className="text-[#FFB300]">Trackpi</span> Talent Hunt
                </h2>

                <div className="flex flex-col items-center justify-center gap-12 text-center">



                    {/* Image Content - Centered */}
                    <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-[1700px]">

                            <img
                                src={talentHuntIllustration}
                                alt="Trackpi Talent Hunt"
                                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrackpiTalentHunt;
