import React from "react";
import vectorImg from "../../assets/Talent league/ui ux/Vector 3 1.png";

export default function PreviousWinners() {
    // Ideally we'd have individual assets, but it seems the uploaded images 
    // might be full layout screenshots. Rendering just one for now.
    const winnerImage = "/assets/winners/winner-final.png";

    return (
        <section className="relative bg-transparent pt-16 pb-20 text-center">

            <div className="relative z-10 flex justify-center items-center px-4">
                <div className="z-20 pointer-events-none">
                    <img
                        alt="Previous Winner"
                        className="rounded-3xl object-contain shadow-2xl"
                        src="/assets/winners/winner-final.png"
                        style={{ width: "1290.72px", height: "473.05px" }}
                    />
                </div>
            </div>
        </section>
    );
}
