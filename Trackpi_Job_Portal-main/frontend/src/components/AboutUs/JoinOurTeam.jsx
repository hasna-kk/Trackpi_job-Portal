import joinImg from "../../assets/about images/join.png";

const JoinOurTeam = () => {
  return (
    <section className="bg-white pt-20 ">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2
          className="text-[32px] md:text-[52px] font-bold mb-6 md:mb-10 text-shadow-title"
        >
          Join <span className="text-[#FFB300]">our team</span>
        </h2>

        {/* Description */}
        <p className="text-black text-[16px] md:text-[22px] leading-relaxed md:leading-[38px] max-w-5xl mx-auto mb-12 md:mb-24 px-4 font-urbanist">
          The Trackpi's hiring team reviews all applications anonymously and will
          be in touch if there is a fit. If you need to get in touch with them,
          please email <span className="font-semibold text-[#FFB300]">hr@trackpi.in</span>. The
          people who make up Trackpi are specialists in the ways of
          organizational culture and transformation. Yet within that world we
          are generalists drawing freely from the principles and practices of
          dozens of theories and hundreds of iconoclastic firms. We are coaches,
          facilitators, academics, psychologists, technologists, and corporate
          veterans who have found each other in our quest to make work better.
          Our backgrounds are varied but our ambition is united.
        </p>

        {/* Image */}
        <div className="flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-xl max-w-[520px] w-full">
            <img
              src={joinImg}
              alt="Join our team"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default JoinOurTeam;
