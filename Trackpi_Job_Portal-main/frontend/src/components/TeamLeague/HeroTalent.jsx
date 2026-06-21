import trophyWireframe from '../../assets/competitions/trophy-wireframe-new.png';
import mainComposition from '../../assets/competitions/chess_piece2.jpg';

export default function HeroTalent() {
    const scrollToCompetitions = () => {
        const section = document.getElementById('explore-competitions');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen bg-black text-white px-6 lg:px-20 flex items-center justify-start overflow-x-hidden pb-10">

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .rgb-shift {
                    text-shadow: 1px 0px rgba(255,0,0,0.9), -1px 0px rgba(0,255,255,0.9);
                    letter-spacing: 0.05em;
                }
                .heading-glow {
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
                }
                .yellow-glow {
                    text-shadow: 0 0 20px rgba(255, 179, 0, 0.35);
                }
                .text-gradient-y-w {
                    background: linear-gradient(to right, #FFB300, #FFFFFF);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .text-gradient-w-y {
                    background: linear-gradient(to right, #FFFFFF, #FFB300);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Background elements removed for solid black background */}


                {/* Main Composition (Chess Pieces) */}
                <div
                    className="absolute inset-y-0 right-0 z-0 w-[55%] flex items-center justify-end pointer-events-none"
                    style={{
                        transform: 'translateY(-15%) translateX(-8%)',
                        maskImage: 'linear-gradient(to left, transparent 0%, black 25%, black 70%, transparent 100%), linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 25%, black 70%, transparent 100%), linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)',
                        WebkitMaskComposite: 'source-in'
                    }}
                >
                    <img
                        src={mainComposition}
                        alt="Composition"
                        className="w-full h-full object-contain mix-blend-screen opacity-100"
                        style={{ objectPosition: 'center bottom' }}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start justify-center gap-0 -mt-20">
                {/* Centered Content (Heading) */}
                <div className="relative z-20 flex flex-col items-center text-center w-full max-w-5xl mx-auto">
                    {/* Trophy near heading */}
                    <img
                        src={trophyWireframe}
                        alt="Trophy Decoration"
                        className="absolute left-[0%] lg:left-[-4%] top-[-60px] lg:top-[-105px] w-[120px] lg:w-[220px] opacity-100 pointer-events-none z-0 transform rotate-6"
                        style={{ filter: 'drop-shadow(0 0 15px rgba(104, 86, 207, 0.6))' }}
                    />
                    <h1 className="relative z-10 font-russo font-normal text-[36px] lg:text-[60px] lg:leading-[1.13] tracking-[-1px] mb-8 text-center w-full max-w-[877px] mx-auto">
                        <span className="text-gradient-w-y heading-glow">A place to</span> <span className="text-gradient-y-w yellow-glow">display your Talent</span>{" "}
                        <br className="hidden lg:block" />
                        <span className="text-gradient-y-w yellow-glow">with our</span> <span className="text-gradient-w-y heading-glow">competition</span>
                    </h1>
                </div>
                {/* Content Row: Text Block */}
                <div className="w-full relative flex items-center mt-16">
                    {/* Left Content: Text Block */}
                    <div className="z-20 w-full lg:w-[642px] flex flex-col items-start text-left">
                        <p className="text-white font-raleway text-[24px] leading-[1.32] mb-10 text-left">
                            Join our Internship Talent Competition and prove your skills in design,
                            editing, or development. Winners not only earn recognition but also unlock a direct path to
                            our internship program — <span className="font-raleway italic rgb-shift">where talent meets opportunity!</span>
                        </p>

                        {/* Competition Button - Strict Layout Specs: 230x47px, 10px Radius, 1px Border, 10px Pad/Gap */}
                        <button 
                            onClick={scrollToCompetitions}
                            className="group relative flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] mt-8"
                            style={{
                                width: '230px',
                                height: '47px',
                                background: 'linear-gradient(90deg, #5c48b7 0%, #301648 45%, #301648 55%, #cb3298 100%)',
                                border: '1px solid #FFB300',
                                borderRadius: '10px',
                                padding: '10px',
                                gap: '10px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <span className="font-russo text-[22px] text-white leading-none tracking-tight">Competition</span>
                            <div className="w-[28px] h-[28px] border-[1px] border-[#FFB300] rounded-full flex items-center justify-center">
                                <svg 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#FFB300" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="transform transition-transform group-hover:translate-y-0.5"
                                >
                                    <path d="M7 13l5 5 5-5M12 18V6" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section >
    );
}