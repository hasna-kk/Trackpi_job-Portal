import rightSideGlow from "../../assets/competitions/right_side_glow.png";

export default function JoinTeam() {
    return (
        <section className="relative bg-black pt-0 pb-20 px-6 lg:px-20 text-white overflow-hidden">


            <div className="relative z-10 flex justify-center items-center">
                <div className="w-full max-w-6xl pointer-events-none">
                    <img
                        src="/assets/team/join-team-final.png"
                        alt="Join our team"
                        className="relative z-10 w-full h-auto rounded-xl object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
