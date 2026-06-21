import React, { useState, useEffect } from "react";
import { FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
        const data = await res.json();
        if (data.success) {
          setTeamMembers(data.data);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return null; // Or a skeleton
  if (teamMembers.length === 0) return null;

  return (
    <section className="bg-gray-50 py-20">
      <h2
        className="text-center text-[32px] md:text-[50px] font-bold mb-12 md:mb-16"
        style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
      >
        Meet <span className="text-yellow-400">Our Team</span>
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 place-items-center">
        {teamMembers.map((member, i) => (
          <div
            key={member._id || i}
            className="
              bg-white rounded-[16px] shadow-lg
              relative overflow-hidden transition-transform hover:scale-105 duration-300
            "
            style={{ width: "243px", height: "328px" }}
          >
            {/* Image (Centered at top) */}
            <div 
              className="absolute top-[21px] left-[55.5px] w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-md"
            >
              <img
                src={member.image?.url}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h4 
              className="absolute text-black line-clamp-1"
              style={{
                top: "165px",
                left: "40.5px", // Adjusted from 71 to center (243-162)/2 or similar if width 162. User said 102 wide, 71 left. (243-102)/2 = 70.5. So 71 is center.
                width: "162px", // Increased from 102 to 162 to allow for longer names without line-breaking too early while maintaining centering
                height: "37px",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 500,
                fontSize: "25px",
                lineHeight: "100%",
                textAlign: "center"
              }}
            >
              {member.name}
            </h4>

            {/* Designation */}
            <p 
              className="absolute text-gray-500 line-clamp-1"
              style={{
                top: "200px",
                left: "37px",
                width: "169px",
                height: "29px",
                fontFamily: "Lato, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "100%",
                textAlign: "center"
              }}
            >
              {member.designation}
            </p>

            {/* Icons */}
            <div className="absolute top-[250px] left-0 w-full flex justify-center gap-4">
              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-yellow-500 transition-colors">
                <FaLinkedinIn size={14} />
              </span>
              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-yellow-500 transition-colors">
                <FaEnvelope size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
