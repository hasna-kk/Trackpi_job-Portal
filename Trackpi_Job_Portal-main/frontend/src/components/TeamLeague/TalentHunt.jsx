import HeroTalent from "./HeroTalent";
import ExploreCompetitions from "./ExploreCompetitions";
import TrackpiTalentHunt from "./TrackpiTalentHunt";
import NavbarTalent from "./NavbarTalent"; // Assuming a specific navbar or use global

export default function TalentHunt() {
    return (
        <div className="bg-black min-h-screen overflow-hidden">
            {/* Note: Navbar might be in App.jsx or Layout, adding Hero directly */}
            <HeroTalent />
            <div className="relative z-10 -mt-20">
                <ExploreCompetitions />
            </div>
            <div className="relative z-10 -mt-[1px]">
                <TrackpiTalentHunt />
            </div>
        </div>
    );
}
