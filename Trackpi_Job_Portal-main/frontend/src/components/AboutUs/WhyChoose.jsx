import consultImg from "../../assets/icons/consult.png";
import guideImg from "../../assets/icons/guide.png";
import resultImg from "../../assets/icons/result.png";

const WhyChoose = () => {
  return (
    <section className="bg-white pt-10 pb-20 px-6">
      {/* Heading */}
      <h2
        className="
          font-cabinet
          font-bold
          text-[40px] md:text-[64px]
          leading-tight md:leading-[80px]
          text-center
          mb-8 md:mb-16  
          text-black
        "
      >
        Why Choose <span className="text-[#FFB300]">Trackpi ?</span>
      </h2>


      {/* Cards */}
      <div className="max-w-[1171px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[52px] px-6">
        {[
          {
            src: consultImg,
            title: "Expert Consulting",
            desc: "Our experienced consultants guide your career and business to success.",
          },
          {
            src: guideImg,
            title: "Personalized Guidance",
            desc: "We understand your unique needs and craft solutions just for you.",
          },
          {
            src: resultImg,
            title: "Proven Results",
            desc: "We’ve helped hundreds achieve measurable career growth.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="
              bg-[#FFEEA9]
              rounded-[24px]
              px-8
              py-10
              text-center
              shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            "
          >
            {/* Icon */}
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <img
                src={item.src}
                alt={item.title}
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-[22px] font-bold mb-3 text-black">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[16px] leading-[26px] text-gray-700">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;
