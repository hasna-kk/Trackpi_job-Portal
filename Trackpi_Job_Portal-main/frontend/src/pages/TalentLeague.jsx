import NavbarTalent from "../components/TeamLeague/NavbarTalent";
import Footer from "../components/Footer";

import vectorImg from "../assets/Talent league/ui ux/Vector 3 1.png";

import TalentHunt from "../components/TeamLeague/TalentHunt";
import PreviousWinners from "../components/TeamLeague/PreviousWinners";
import JoinTeam from "../components/TeamLeague/JoinTeam";

export default function TalentLeague() {
    return (
        <div className="w-full overflow-x-hidden bg-black relative">
            <div className="absolute top-0 right-[-10%] w-[45%] h-full pointer-events-none z-0 overflow-visible">
                <img
                    src={vectorImg}
                    alt=""
                    className="w-full h-full object-cover mix-blend-screen opacity-20 brightness-110 saturate-100"
                    style={{ 
                        transform: 'scaleX(-1)',
                        maskImage: 'radial-gradient(circle at right, black 30%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(circle at right, black 30%, transparent 80%)'
                    }}
                />
            </div>
            <NavbarTalent />

            <TalentHunt />
            <PreviousWinners />
            <JoinTeam />
            <Footer />
        </div>
    );
}
