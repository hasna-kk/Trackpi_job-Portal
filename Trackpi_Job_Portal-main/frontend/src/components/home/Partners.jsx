// src/components/Partners.jsx
import { useEffect, useState } from "react";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hiringpartners?page=1&limit=20")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPartners(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setPartners([]);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!partners.length) return null;

  // We duplicate the list to ensure a seamless infinite loop.
  // The animation moves the container by exactly one set's width.
  const track = [...partners, ...partners];

  return (
    <section className="py-12 bg-white font-cabinet overflow-hidden">
      <h2 className="text-center text-[28px] md:text-[42px] font-[900] mb-12 tracking-tight uppercase">
        OUR <span className="text-[#FFB300]">HIRING PARTNERS</span>
      </h2>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative flex overflow-hidden">
        {/* Left/Right masks for a premium "fade in/out" look */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="marquee-container flex items-center gap-20 md:gap-32 px-10">
          {track.map((partner, index) => (
            <div key={index} className="flex-shrink-0 flex justify-center items-center px-4">
              <img
                src={partner.logo?.url}
                alt={partner.organizationname}
                className="h-16 md:h-24 w-auto object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
