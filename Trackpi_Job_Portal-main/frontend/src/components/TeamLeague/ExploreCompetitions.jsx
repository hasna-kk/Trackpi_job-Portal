import React from "react";
import { Link } from "react-router-dom";
import graphicDesignerImg from "../../assets/illustrations/side_circle_requested.png";
import uiUxDesignerImg from "../../assets/illustrations/ui_ux_middle_requested.png";
import videoEditorImg from "../../assets/illustrations/side_circle_requested.png";
import trophyWireframe from "../../assets/competitions/trophy-wireframe-new.png";
import vectorRightImg from "../../assets/Talent league/ui ux/Vector 3 1.png";

const ExploreCompetitions = () => {
    const competitions = [
        {
            title: "Graphic designer",
            image: graphicDesignerImg,
            description: "Unleash your creativity! Join the graphic design challenge and show the world your unique visual style.",
        },
        {
            title: "UI UX Designer",
            image: uiUxDesignerImg,
            description: "Build intuitive and beautiful experiences! Showcase your interaction design and problem-solving skills.",
            isCenter: true,
        },
        {
            title: "Video editors",
            image: videoEditorImg,
            description: "Craft compelling stories! Test your video editing abilities to create engaging and dynamic reels.",
        },
    ];

    return (
        <section id="explore-competitions" className="relative w-full pt-28 pb-40 bg-transparent overflow-hidden">
            {/* Background Glows (Optional, to match theme) */}
            {/* Background Glows removed as per request */}

            {/* Confetti Background - Restored */}


            {/* Background elements removed for clean black background */}

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <div className="relative inline-block">
                    <img
                        src={trophyWireframe}
                        alt="Trophy Background"
                        className="absolute left-[56%] top-[60%] -translate-x-1/2 -translate-y-1/2 w-[140px] md:w-[280px] opacity-100 pointer-events-none z-0 transform -rotate-[18deg]"
                        style={{ filter: 'drop-shadow(0 0 25px rgba(104, 86, 207, 0.8))' }}
                    />
                    <h2 className="relative z-10 font-russo mb-32 text-center" style={{
                        fontSize: '48px',
                        lineHeight: '100%',
                        color: '#FFB300',
                        textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)'
                    }}>
                        Explore our competitions
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 relative">
                    {/* Spanning Confetti Background for Graphic Designer and UI/UX Designer */}
                    <div className="absolute left-[-250px] lg:left-[-20%] bottom-[-300px] w-[800px] h-[800px] pointer-events-none z-30 opacity-70">
                        <img
                            src="/assets/confetti_bg.png"
                            alt=""
                            className="w-full h-full rounded-full opacity-100 mix-blend-screen object-contain brightness-125 saturate-150 contrast-110"
                        />
                    </div>

                    {/* Navigation Arrows (Visual Only for now as per image) */}
                    <button className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 text-[#FFB300] text-3xl hover:scale-110 transition-transform z-30">
                        <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-[#FFB300] text-3xl hover:scale-110 transition-transform z-30">
                        <i className="ri-arrow-right-s-line"></i>
                    </button>

                    {competitions.map((comp, index) => (
                        <div
                            key={index}
                            className={`relative rounded-full border border-[#FFB300]/30 bg-gradient-to-b from-[#FFB300]/25 to-[#010102] p-4 flex flex-col items-center text-center transition-all duration-300 group hover:border-[#FFB300] shadow-[0_0_50px_rgba(255,179,0,0.12)]
                                ${comp.isCenter
                                    ? 'w-[260px] h-[260px] md:w-[340px] md:h-[340px] z-20 scale-105 lg:translate-y-16 justify-start pt-6 md:pt-8 gap-0'
                                    : 'w-[220px] h-[220px] md:w-[290px] md:h-[290px] z-10 lg:-translate-y-16 justify-start pt-5 md:pt-6 gap-1'}
                            `}
                        >
                            {/* Decorative Trophies removed for cleanup */}

                            {/* Confetti removed from here as it now spans multiple circles at the section level */}
                            <h3 className="text-white text-sm md:text-lg leading-tight z-10">{comp.title}</h3>

                            <div className={`relative z-10 ${comp.isCenter ? 'w-48 h-48 md:w-56 md:h-56 -mt-4 md:-mt-8 mb-0' : 'w-20 h-20 md:w-28 md:h-28'}`}>
                                <img src={comp.image} alt={comp.title} className="w-full h-full object-contain" />
                            </div>

                            <p className={`text-gray-400 text-[9px] md:text-[11px] px-3 leading-tight z-10 mb-3 ${comp.isCenter ? '-mt-6 md:-mt-10' : ''}`}>
                                {comp.description}
                            </p>

                            <div className="mt-auto mb-3 md:mb-5 z-10">
                                {comp.title === "UI UX Designer" ? (
                                    <Link to="/competition/ui-ux">
                                        <button className="px-8 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black font-bold text-[10px] md:text-xs border border-white hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                                            Go On <i className="ri-arrow-right-s-line text-xs md:text-sm"></i>
                                        </button>
                                    </Link>
                                ) : (
                                    <button className="px-8 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black font-bold text-[10px] md:text-xs border border-white hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                                        Coming Soon
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreCompetitions;
