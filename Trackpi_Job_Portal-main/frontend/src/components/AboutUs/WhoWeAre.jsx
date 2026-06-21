import weareImg from "../../assets/about images/weare.png";

const WhoWeAre = () => {
  return (
    <section className="bg-white py-20">
      {/* Small gray background container */}
      <div className="max-w-7xl mx-auto md:bg-gray-50 md:rounded-[24px] px-6 md:px-10 py-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h3
              className="
                font-cabinet
                font-bold
                text-[32px] md:text-[48px]
                leading-tight md:leading-[60px]
                mb-6
                text-black
              "
            >
              <span className="text-yellow-400">We’re The</span>{" "}
              Trackpi
            </h3>

            <p className="text-[18px] leading-[32px] text-black-600 max-w-xl">
              We’re here to change how the world works—from business as usual to
              brave new work. It takes an unusual person to disrupt decades of
              tradition and guide hundreds or thousands of people through an
              experience that demands their bravery, vulnerability, and
              curiosity. It takes conviction to join a decentralized,
              self-managing, public benefit corporation where reputation matters
              more than position.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={weareImg}
              alt="Who We Are"
              className="
                w-full
                max-w-[520px]
                rounded-[24px]
                object-cover
                shadow-[0_20px_40px_rgba(0,0,0,0.15)]
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
