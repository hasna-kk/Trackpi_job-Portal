import meetingImg from "../../assets/about images/meeting.png";
import brochurePdf from "../../assets/Trackpi Brochure.pdf";
import { LuDownload } from "react-icons/lu";

const AboutHero = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-28 lg:pt-32 pb-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-[50px] font-bold mb-4 leading-[36px]">
                    About <span className="text-yellow-400">Trackpi</span>
                </h2>

                <p className="font-urbanist text-[18px] md:text-[24px] text-[#555555] leading-[1.4] max-w-2xl font-medium">
                    Trackpi is one of the best business consulting companies in Kerala,
                    based in Kochi. We help businesses succeed by providing a strategic
                    advantage over competitors with expert guidance. Trackpi also offers
                    opportunities for freelance associates to earn and grow, becoming part of
                    its organic and boundless freelance community.
                </p>

                <div className="flex justify-start pt-4">
                    <button
                        onClick={() => window.open(brochurePdf, '_blank')}
                        className="bg-[#FFB300] px-8 py-3 rounded-[8px] font-bold text-white flex items-center gap-2 hover:bg-[#e6a100] transition-all shadow-[0_4px_14px_rgba(255,179,0,0.39)] active:scale-95"
                    >
                        Company Brochure
                        <LuDownload size={22} className="stroke-[2.5px]" />
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <img
                    src={meetingImg}
                    alt="About Trackpi"
                    className="rounded-[40px] w-full max-w-[650px] object-cover shadow-xl"
                />
            </div>
        </section>
    );
};

export default AboutHero;
