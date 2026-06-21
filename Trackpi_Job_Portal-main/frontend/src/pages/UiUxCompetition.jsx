import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Award, Users, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

// Assets (Using placeholders or existing assets if available)
import heroBackground from "../assets/competitions/hero_background.png";
import designerIllustration from "../assets/Talent league/ui ux/user-interface-development-isometric-concept-with-young-woman-creating-custom-design-mobile-application-vector-illustration 1.png";
import ellipse1 from "../assets/Talent league/ui ux/Ellipse 1841.png";
import ellipse2 from "../assets/Talent league/ui ux/Ellipse 1842.png";
import trophyWireframe from "../assets/competitions/trophy-wireframe-new.png";
import winnerAvatar from "../assets/competitions/chess_piece1.png"; // Placeholder for winners
import teamMeetingImg from "../assets/Talent league/ui ux/ui_ux_team_meeting.png"; // New imported image
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import previousWinnersImg from "../assets/Talent league/ui ux/previous winners.png";
import excellenceEllipse from "../assets/Talent league/ui ux/excellence_ellipse.png";
import championTrophy from "../assets/Talent league/ui ux/champion_trophy.png";
import excellenceBottomEllipse from "../assets/Talent league/ui ux/excellence_bottom_ellipse.png";
import excellenceRightWinners from "../assets/Talent league/ui ux/excellence_right_winners.png";
import excellenceRightInternship from "../assets/Talent league/ui ux/excellence_right_internship.png";
import excellenceRightPortfolio from "../assets/Talent league/ui ux/excellence_right_portfolio.png";
import excellenceTrophyWireframe from "../assets/Talent league/ui ux/trophy.png";
import { challengeAudio } from "../utils/audioManager";
import ChallengeModal from "../components/competitions/ChallengeModal";

const UiUxCompetition = () => {
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const unsubscribe = challengeAudio.subscribe(setIsPlaying);
        challengeAudio.play();
        return unsubscribe;
    }, []);

    const togglePlay = () => {
        challengeAudio.toggle();
    };





    return (
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white font-sans">
            {/* Hero Section (Section 1) */}
            <section className="relative w-full h-screen overflow-hidden bg-black">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroBackground}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    {/* Decorative Ellipses */}
                    <img src={ellipse1} alt="" className="absolute top-[-10%] left-[-10%] w-[60%] opacity-20 pointer-events-none blur-3xl" />
                    <img src={ellipse2} alt="" className="absolute bottom-[-10%] right-[-10%] w-[50%] opacity-15 pointer-events-none blur-[100px]" />

                    {/* Minimal Overlays to maintain clarity */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                        }}
                    ></div>
                </div>

                {/* Top Left: Back Arrow */}
                <div className="absolute top-8 left-8 z-20">
                    <Link to="/talent-league" className="text-yellow-500 hover:scale-110 transition-transform">
                        <i className="ri-arrow-go-back-fill text-2xl drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"></i>
                    </Link>
                </div>

                {/* Bottom Right: Volume Icon */}
                <div className="absolute bottom-10 right-10 z-20">
                    <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100 rounded-full px-2 py-2 flex items-center justify-center">
                        <i className={isPlaying ? "ri-volume-up-fill text-3xl" : "ri-volume-mute-fill text-3xl"}></i>
                    </button>
                </div>

                {/* Bottom Left: Buttons and Watch Now */}
                <div className="absolute bottom-12 left-10 lg:left-24 z-20 flex flex-col gap-6 items-start">
                    <div className="flex gap-4">
                        <Link to="/competition/testimonials">
                            <button className="relative inline-flex overflow-hidden rounded-xl p-[1.5px] shadow-[0_10px_30px_rgba(234,179,8,0.2)] group transition-transform hover:scale-[1.02]">
                                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#FFB300_50%,#000000_100%)]" />
                                <span className="relative inline-flex h-full w-full items-center justify-center rounded-[10.5px] bg-black px-8 py-3 font-bold text-sm text-white transition-colors group-hover:bg-[#1a1a1a]">
                                    Testimonials
                                </span>
                            </button>
                        </Link>
                        <button
                            onClick={() => setShowChallengeModal(true)}
                            className="relative inline-flex overflow-hidden rounded-xl p-[1.5px] shadow-[0_10px_30px_rgba(234,179,8,0.3)] group transition-transform hover:scale-[1.02]"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#EAB308_0%,#000000_50%,#EAB308_100%)]" />
                            <span className="relative inline-flex h-full w-full items-center justify-center rounded-[10.5px] bg-yellow-500 px-8 py-3 font-bold text-sm text-black transition-colors group-hover:bg-yellow-400">
                                Register Competition
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Downwards Content (Section 2) */}
            <section className="relative px-6 lg:px-20 py-32 bg-black overflow-hidden border-t border-white/5">
                {/* Right Side Yellow Glow Shade - Refined amber intensity */}
                <div
                    className="absolute top-0 right-[-10%] w-1/3 h-full pointer-events-none opacity-20 z-0"
                    style={{
                        background: 'radial-gradient(ellipse at center right, rgba(255, 179, 0, 0.4) 0%, transparent 70%)',
                        filter: 'blur(120px)'
                    }}
                ></div>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16 mb-24 relative z-10">
                    {/* Left: Text Content */}
                    <div className="flex-1 flex flex-col items-center lg:items-start space-y-10 lg:mt-24">
                        <h2
                            style={{
                                fontFamily: "'Russo One', sans-serif",
                                fontWeight: 400,
                                fontSize: '32px',
                                color: '#FFB300',
                                width: '554px',
                                height: '32px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)',
                                flex: 'none',
                                order: 0,
                                alignSelf: 'stretch',
                                flexGrow: 0
                            }}
                            className="whitespace-nowrap"
                        >
                            Talent league for UI UX Designers
                        </h2>
                        <p className="text-white leading-relaxed text-xl font-raleway w-full lg:max-w-xl opacity-90">
                            Whether you're a beginner, student, or professional, this competition is your chance to demonstrate your design thinking, visual skills, and ability to solve user problems through intuitive design. Submit your best work, impress our judging panel, and stand a chance to earn certificates, recognition, and exciting rewards—including opportunities for internships based on performance.
                        </p>
                    </div>

                    {/* Right: Graphic */}
                    <div className="flex-1 relative flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Visual Glow (Ellipse 1) - Finalized horizontal positioning */}
                            <img
                                src={ellipse1}
                                alt=""
                                className="absolute top-[45%] -left-[20%] w-[291px] h-[291px] pointer-events-none mix-blend-screen"
                            />

                            {/* Visual Glow (Ellipse 2) - Positioned slightly lower for subtle balance */}
                            <img
                                src={ellipse2}
                                alt=""
                                className="absolute top-[7%] -right-10 w-[212px] h-[212px] pointer-events-none mix-blend-screen"
                            />

                            <img
                                src={designerIllustration}
                                alt="Design Illustration"
                                className="relative z-10 w-full max-w-[584px] h-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Upcoming Competition Block */}
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h3
                        style={{
                            fontFamily: "'Russo One', sans-serif",
                            fontWeight: 400,
                            fontSize: '32px',
                            color: '#FFB300',
                            width: '511px',
                            height: '32px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            letterSpacing: '0px',
                            textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)',
                            margin: '0 auto 40px auto'
                        }}
                        className="uppercase flex items-center justify-center whitespace-nowrap"
                    >
                        UPCOMING COMPETITION
                    </h3>

                    <div className="inline-block relative">
                        {/* Background wireframe trophy on the left */}
                        <div
                            className="absolute left-[-420px] bottom-[-100px] hidden lg:block pointer-events-none"
                            style={{
                                width: '353.18px',
                                height: '468.41px',
                                opacity: 0.6, // Balanced prominence
                                transform: 'rotate(5deg)',
                                filter: 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.7)) brightness(1.1)', // Vibrant cobalt-blue shade
                                zIndex: 0
                            }}
                        >
                            <img
                                src={trophyWireframe}
                                alt="Trophy"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Competition Card */}
                        <div
                            style={{
                                width: '511px',
                                height: '196px',
                                borderRadius: '40px',
                                flex: 'none',
                                order: 1,
                                flexGrow: 0,
                                position: 'relative',
                                margin: '0 auto',
                                zIndex: 10
                            }}
                            className="shadow-2xl"
                        >
                            {/* Gradient Border Overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    borderRadius: '40px',
                                    padding: '1px',
                                    background: 'linear-gradient(to bottom, #FFFFFF, #FFB300)',
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    zIndex: 20
                                }}
                            ></div>

                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    borderRadius: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Decorative Texture/Confetti */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle,white_1px,transparent:2px)] bg-[size:50px_50px]"></div>
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,white_0.5px,transparent:1.5px)] bg-[size:30px:30px] rotate-12"></div>
                                {/* Large background confetti */}
                                <img
                                    src={goldConfetti}
                                    alt="Gold Confetti background"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        top: '0',
                                        left: '0',
                                        opacity: 0.4,
                                        pointerEvents: 'none',
                                        objectFit: 'cover',
                                        filter: 'brightness(1.3) saturate(1.5)'
                                    }}
                                />
                                {/* Right-side specific confetti */}
                                <img
                                    src={goldConfetti}
                                    alt="Gold Confetti Right"
                                    style={{
                                        position: 'absolute',
                                        width: '205px',
                                        height: '136px',
                                        top: '63px',
                                        left: '306px',
                                        opacity: 0.8,
                                        pointerEvents: 'none',
                                        filter: 'brightness(1.5) saturate(1.8)'
                                    }}
                                />
                                {/* Left-side specific confetti */}
                                <img
                                    src={goldConfetti}
                                    alt="Gold Confetti Left"
                                    style={{
                                        position: 'absolute',
                                        width: '294px',
                                        height: '196px',
                                        top: '52px',
                                        left: '0px',
                                        opacity: 0.8,
                                        pointerEvents: 'none',
                                        filter: 'brightness(1.5) saturate(1.8)'
                                    }}
                                />

                                <h4
                                    style={{
                                        fontFamily: "'Russo One', sans-serif",
                                        fontWeight: 400,
                                        fontSize: '32px',
                                        color: '#FFB300',
                                        width: '177px',
                                        height: '32px',
                                        lineHeight: '100%',
                                        textAlign: 'center',
                                        letterSpacing: '0px',
                                        textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)',
                                        margin: '0 auto'
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    July month
                                </h4>

                                {/* Divider dash from the image */}
                                <div className="w-10 h-1 bg-white opacity-40 rounded-full mt-6 mb-6"></div>

                                {/* Competition Dates Section */}
                                <div
                                    style={{
                                        width: '288.15px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: '#FFFFFF',
                                        fontFamily: "'Russo One', sans-serif"
                                    }}
                                >
                                    <div
                                        style={{ width: '124.6px', height: '40px' }}
                                        className="flex flex-col items-center justify-center"
                                    >
                                        <span style={{ fontSize: '20px', lineHeight: '100%' }} className="uppercase">Start Date</span>
                                        <span style={{ fontSize: '20px', lineHeight: '100%' }}>20-07-2025</span>
                                    </div>

                                    <div className="text-[20px] opacity-40">—</div>

                                    <div
                                        style={{ width: '117.15px', height: '40px' }}
                                        className="flex flex-col items-center justify-center"
                                    >
                                        <span style={{ fontSize: '20px', lineHeight: '100%' }} className="uppercase">End Date</span>
                                        <span style={{ fontSize: '20px', lineHeight: '100%' }}>26-07-2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Excellence Rewards */}
            <section className="px-6 lg:px-20 pt-20 pb-0 bg-[#050505] flex flex-col items-center relative z-20">
                <h3
                    style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontWeight: 400,
                        fontSize: '48px',
                        lineHeight: '100%',
                        letterSpacing: '0px',
                        textAlign: 'center',
                        color: '#FFB300',
                        textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)',
                        marginBottom: '40px',
                        position: 'relative',
                        top: '-80px'
                    }}
                    className=""
                >
                    Excellence Rewards
                </h3>
                {/* Ellipse Arch and Trophy Container */}
                <div className="w-full flex justify-center max-w-5xl relative">
                    <img
                        src={excellenceEllipse}
                        alt="Excellence Rewards Arc"
                        className="w-full h-auto object-cover"
                    />

                    {/* Yellow Ambient Shade/Glow - Positioned Above the Trophy */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, rgba(255, 179, 0, 0.15) 0%, transparent 80%)",
                            filter: "blur(80px)",
                            zIndex: 50
                        }}
                    ></div>
                    {/* Excellence Wireframe Trophy - Positioned on the Right Side */}
                    <img
                        src={excellenceTrophyWireframe}
                        alt="Wireframe Trophy Background"
                        className="absolute top-[75%] right-[2%] -translate-y-1/2 w-[350px] h-auto pointer-events-none opacity-70"
                        style={{
                            zIndex: 10,
                            filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(0, 102, 255, 0.8))'
                        }}
                    />
                    {/* Black Circle Background */}
                    <div
                        className="absolute rounded-full bg-[#000000] pointer-events-none"
                        style={{
                            width: '213px',
                            height: '213px',
                            top: '320.2px',
                            left: '-41.4px',
                            border: '0.86px solid #FFFFFF'
                        }}
                    ></div>

                    {/* Bottom-left Ellipse Image Overlay */}
                    <img
                        src={excellenceBottomEllipse}
                        alt="Bottom Left Ellipse"
                        className="absolute pointer-events-none object-contain"
                        style={{ width: '254.7px', height: '212.3px', top: '275.5px', left: '-60px' }}
                    />

                    {/* Title under image */}
                    <h4
                        className="absolute pointer-events-none text-center"
                        style={{
                            width: '159.2px',
                            top: '463.8px',
                            left: '-14.5px',
                            fontFamily: "'Russo One', sans-serif",
                            fontSize: '16.5px',
                            fontWeight: '400',
                            lineHeight: '1.2',
                            background: 'linear-gradient(to bottom, #FFFFFF, #FFB300)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke: '0.5px #000000',
                            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                            zIndex: 40,
                            textTransform: 'uppercase'
                        }}
                    >
                        REGISTER<br />OUR COMPETITION
                    </h4>
                    {/* Winners Illustration - Positioned along the arc */}
                    <img
                        src={excellenceRightWinners}
                        alt="Winners"
                        className="absolute pointer-events-none object-contain"
                        style={{ width: '254.7px', height: '254.7px', top: '-75px', left: '170px', zIndex: 30 }}
                    />

                    {/* Internship Illustration - Mirror on the right side */}
                    <img
                        src={excellenceRightInternship}
                        alt="Get Internship"
                        className="absolute pointer-events-none object-contain"
                        style={{ width: '254.7px', height: '254.7px', top: '-75px', right: '170px', zIndex: 30 }}
                    />

                    {/* Dream Portfolio Illustration - Mirror of Register on the right */}
                    <img
                        src={excellenceRightPortfolio}
                        alt="Build Dream Portfolio"
                        className="absolute pointer-events-none object-contain"
                        style={{ width: '254.7px', height: '254.7px', top: '275.5px', right: '-60px', zIndex: 30 }}
                    />
                    {/* Champion Trophy Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img
                            src={championTrophy}
                            alt="Champion Trophy"
                            style={{ width: '482px', height: '276.64px' }}
                            className="object-contain translate-y-12"
                        />
                    </div>
                </div>
            </section>

            {/* Previous Winners */}
            <section className="px-6 lg:px-20 py-24 text-center">
                <h3
                    style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontWeight: 400,
                        fontSize: '48px',
                        lineHeight: '100%',
                        letterSpacing: '0px',
                        textAlign: 'center',
                        color: '#FFB300',
                        textShadow: '0px 4px 4px rgba(255, 255, 255, 0.45)',
                        marginBottom: '64px'
                    }}
                    className=""
                >
                    Previous competitions Winners
                </h3>
                <div className="flex justify-center w-full max-w-7xl mx-auto">
                    <img
                        src={previousWinnersImg}
                        alt="Previous Competition Winners"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center items-center gap-16 mt-12 mb-4">
                    <button className="w-[45px] h-[45px] rounded-[8px] border-[1.5px] border-[#FFB300] flex justify-center items-center text-[#FFB300] hover:bg-[#FFB300]/10 transition">
                        <i className="ri-arrow-left-s-line text-3xl font-light"></i>
                    </button>
                    <button className="w-[45px] h-[45px] rounded-[8px] border-[1.5px] border-[#FFB300] flex justify-center items-center text-[#FFB300] hover:bg-[#FFB300]/10 transition">
                        <i className="ri-arrow-right-s-line text-3xl font-light"></i>
                    </button>
                </div>
            </section>

            {/* Join Section */}
            <section className="relative px-6 lg:px-20 py-24 bg-black border-t border-white/5 overflow-hidden">
                {/* Background Ellipses */}
                <img src={ellipse1} alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] opacity-10 pointer-events-none blur-[120px]" />
                <img src={ellipse2} alt="" className="absolute bottom-0 right-0 w-[40%] opacity-5 pointer-events-none blur-[100px]" />

                <div
                    style={{
                        width: '100%',
                        maxWidth: '1270px',
                        height: '455px'
                    }}
                    className="mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8 relative z-10"
                >
                    <div className="flex flex-col h-full space-y-8 flex-shrink-0" style={{ maxWidth: '733px' }}>
                        <h2
                            style={{
                                fontFamily: "'Russo One', sans-serif",
                                fontWeight: 400,
                                fontSize: '52px',
                                lineHeight: '110%',
                                textAlign: 'left',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Join <span style={{ color: '#FFB300' }}>our UI UX Team</span>
                        </h2>
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '733px',
                                fontFamily: "'Raleway', sans-serif",
                                fontWeight: 400,
                                fontSize: '24px',
                                lineHeight: '36px',
                                color: '#FFFFFF',
                                textAlign: 'justify'
                            }}
                            className="flex flex-col gap-[3rem]"
                        >
                            <p>
                                We are always on the lookout for our next stunning colleague. If you either have experience working closely with organizations to help them think and act differently or are hoping to apply your etu unique skillset toward changing how the world works and we are participating in a self-managing environment, please learn about our hiring process and consider applying with us!
                            </p>
                            <p>
                                The Trackpi's hiring team reviews all applications anonymously and will be in touch if there is a fit. If you need to get in touch with them, please email <span style={{ textDecoration: 'underline', color: '#FFFFFF', textDecorationSkipInk: 'auto' }} className="cursor-pointer">hr@trackpi.in.</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative h-full flex-1 w-full lg:w-auto mt-10 lg:mt-0 flex items-center justify-end">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 rounded-[1.5rem] blur opacity-25"></div>
                        <img
                            src={teamMeetingImg}
                            alt="UX Team Meeting"
                            style={{ height: '455px' }}
                            className="relative w-full object-cover rounded-[1.5rem] shadow-2xl border border-white/5"
                        />
                    </div>
                </div>
            </section>



            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                @keyframes fadeIn {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <ChallengeModal
                isOpen={showChallengeModal}
                onClose={() => setShowChallengeModal(false)}
                department="UI/UX Designer"
            />

            <Footer />
        </div>
    );
};

export default UiUxCompetition;
