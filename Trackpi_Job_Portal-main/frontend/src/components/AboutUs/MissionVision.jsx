import missionIcon from "../../assets/icons/mission.png"; // Replace with your actual paths
import visionIcon from "../../assets/icons/vision.png";
import valuesIcon from '../../assets/icons/value.png'

const MissionVision = () => {
  return (
    <section className="bg-white pb-10 pt-10">
      {/* Section Heading */}
      <h2
        className="text-center font-cabinet font-bold text-[32px] md:text-[50px] leading-tight md:leading-[63px] mb-12 md:mb-16"
        style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
      >
        <span className="text-yellow-400">Our</span> Mission, Vision & Values
      </h2>

      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
        {[
          {
            title: "Mission",
            desc: "To provide career and business consulting solutions.",
            icon: missionIcon
          },
          {
            title: "Vision",
            desc: "To be the leading bridge between talent and opportunity.",
            icon: visionIcon
          },
          {
            title: "Values",
            desc: "Integrity, Growth, Innovation, and Empathy.",
            icon: valuesIcon
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white text-center flex flex-col items-center justify-center p-6"
            style={{
              width: '340.48px',
              height: '265.21px',
              borderRadius: '19.11px',
              boxShadow: '0px 4.78px 19.11px 0px rgba(0, 0, 0, 0.10)',
              maxWidth: '100%', // Ensure responsiveness on very small screens
            }}
          >
            {/* Icon Circle */}
            <div className="bg-[#FFB300] w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
            </div>

            {/* Card Title */}
            <h3 className="font-cabinet font-bold text-[24px] md:text-[28.67px] leading-tight mb-2 text-black">
              <span className="text-[#FFB300]">Our</span> {item.title}
            </h3>

            {/* Card Description */}
            <p
              className="font-lato text-center text-[#555555]"
              style={{
                fontSize: '19.11px',
                lineHeight: '28.67px',
                fontWeight: '400',
                maxWidth: '275px',
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MissionVision;