import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "remixicon/fonts/remixicon.css";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaQuora,
  FaBloggerB,
  FaMediumM,
  FaWhatsapp,
} from "react-icons/fa";

import logoDark from "../assets/logo_footer_v9.png"; // Especially For Black Footer 
import logoLight from "../assets/logo.png";          // For White Footer

const Footer = () => {
  const location = useLocation();
  const isBlackFooter = location.pathname.includes("/talent-league") || 
                        location.pathname.includes("/competition/ui-ux") ||
                        location.pathname.includes("/competition/testimonials");

  // Detect auth state (same approach as Navbar)
  const isLoggedIn = !!localStorage.getItem("token");

  // Guest users see the sidebar on all public landing pages
  const GUEST_SIDEBAR_PAGES = ["/", "/about", "/testimonials", "/contact"];
  // Logged-in users only see it on the Testimonials page
  const AUTH_SIDEBAR_PAGES = ["/testimonials"];

  // Pages where the floating WhatsApp button is visible (guests only on landing + about)
  const WHATSAPP_PAGES = ["/", "/about"];

  const showSidebar = isLoggedIn
    ? AUTH_SIDEBAR_PAGES.includes(location.pathname)
    : GUEST_SIDEBAR_PAGES.includes(location.pathname);
  const showWhatsapp = !isLoggedIn && WHATSAPP_PAGES.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const bgClass = isBlackFooter ? "bg-black" : "bg-white";
  const mainTextClass = isBlackFooter ? "text-white" : "text-black";
  const subTextClass = isBlackFooter ? "text-gray-300" : "text-gray-600";
  const socialHoverClass = isBlackFooter ? "hover:text-white" : "hover:text-black";

  return (
    <>
      <footer 
        className={`${bgClass} py-12 font-cabinet transition-colors duration-300`}
      >
        <div className={`max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 ${mainTextClass}`}>

          {/* 🟡 Logo & About */}
          <div className="flex flex-col gap-6 w-full sm:col-span-2 md:col-span-1">
            <img
              src={isBlackFooter ? logoDark : logoLight}
              alt="TrackPi Logo"
              className="w-[150px] h-auto object-contain"
              style={{ 
                mixBlendMode: "screen",
                filter: "brightness(0.9) contrast(1.5)"
              }}
            />
            <p className={`${subTextClass} text-[18px] leading-relaxed font-urbanist text-left max-w-full`}>
              Empowering businesses to succeed through expert
              guidance and personalized solutions. Unlocking
              potential and achieving success.
            </p>

            {/* ⭐ Social Media - visible on all footers */}
            <div className="flex flex-nowrap gap-4 text-2xl text-[#FFB300] items-center mt-4 w-full overflow-visible">
              <a href="https://www.facebook.com/people/Trackpi-Private-Limited/61565947096778/" target="_blank" rel="noopener noreferrer" className={`${socialHoverClass} transition`}><i className="ri-facebook-circle-line"></i></a>
              <a href="https://www.youtube.com/@trackpi" target="_blank" rel="noopener noreferrer" className={`${socialHoverClass} transition`}><i className="ri-youtube-line"></i></a>
              <a href="https://www.instagram.com/trackpi_official/" target="_blank" rel="noopener noreferrer" className={`${socialHoverClass} transition`}><i className="ri-instagram-line"></i></a>
              <a href="https://medium.com/@trackpi" target="_blank" rel="noopener noreferrer" className={`${socialHoverClass} transition`}><i className="ri-medium-line border border-[#FFB300] rounded p-1 flex items-center justify-center"></i></a>
              <a href="https://www.linkedin.com/company/trackpi-private-limited/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className={`${socialHoverClass} transition`}><i className="ri-linkedin-box-line"></i></a>
              <a href="https://www.quora.com/profile/Trackpi-Private-Limited" target="_blank" rel="noopener noreferrer" className="transition bg-white rounded p-1 flex items-center justify-center w-9 h-9"><svg className="w-full h-full fill-[#FFB300]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.3799.9483A11.9628 11.9628 0 0 1 21.248 19.5397l2.4096 2.4225c.7322.7362.21 1.9905-.8272 1.9905l-10.7105.01a12.52 12.52 0 0 1-.304 0h-.02A11.9628 11.9628 0 0 1 7.3818.9503Zm7.3217 4.428a7.1717 7.1717 0 1 0-5.4873 13.2512 7.1717 7.1717 0 0 0 5.4883-13.2511Z" /></svg></a>
              <a href="https://trackpi.blogspot.com/" target="_blank" rel="noopener noreferrer" className="transition bg-white rounded p-1 flex items-center justify-center w-9 h-9"><i className="ri-blogger-fill text-[#FFB300] text-2xl"></i></a>
            </div>
          </div>


          {/* 🔗 Links */}
          <div className="mt-4 md:pl-16 lg:pl-24">
            <h3 className={`font-extrabold text-lg mb-6 ${mainTextClass} text-left font-urbanist`}>Links</h3>
            <ul className={`space-y-4 ${subTextClass} text-sm text-left font-urbanist font-bold`}>
              <li className="flex items-center">
                <Link to="/" className={`cursor-pointer hover:text-[#FFB300] w-full`}>
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <Link to="/about" className={`cursor-pointer hover:text-[#FFB300] w-full`}>
                  About
                </Link></li>
              <li className="flex items-center">
                <Link to="/contact" className={`cursor-pointer hover:text-[#FFB300] w-full`}>Connect Us</Link></li>
              <li className="flex items-center">
                <Link to="/creators" className={`hover:text-[#FFB300] w-full`}>
                  Creators
                </Link>
              </li>
              <li className={`cursor-pointer hover:text-[#FFB300] flex items-center`}>
                <Link to="/terms" className="w-full">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          {/* 🛠 Services */}
          <div className="mt-4">
            <h3 className={`font-extrabold text-lg mb-6 ${mainTextClass} text-left font-urbanist`}>Services</h3>
            <ul className={`space-y-4 ${subTextClass} text-sm text-left font-urbanist font-bold`}>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Software development</Link></li>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Sales training</Link></li>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Operations training</Link></li>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Software development</Link></li>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Sales training</Link></li>
              <li className="cursor-pointer hover:text-[#FFB300]"><Link to="#">Operations training</Link></li>
            </ul>
          </div>

          {/* 📞 Contact */}
          <div className="mt-4">
            <h3 className={`font-extrabold text-lg mb-6 ${mainTextClass} text-left font-urbanist w-[86px] h-[29px]`}>Contact</h3>

            <div className="font-urbanist w-full max-w-[218px] font-bold">
              <div className={`flex items-start gap-4 text-sm ${subTextClass} mb-6`}>
                <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                  <i className="ri-map-pin-line text-black text-lg"></i>
                </div>
                <p className="text-left">
                  Trackpi Private<br />
                  Limited, 10E BCG<br />
                  Tower, Opp. CSEZ,<br />
                  Seaport-Airport Rd,<br />
                  Kakkanad, Kochi,<br />
                  Kerala - 682037,<br />
                  India
                </p>
              </div>

              <div className={`flex items-center gap-4 font-medium ${subTextClass} mb-6`}>
                <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-line text-black text-lg"></i>
                </div>
                <span>+91 9538610745</span>
              </div>

              <div className={`flex items-center gap-4 font-medium ${subTextClass}`}>
                <div className="w-8 h-8 rounded-full bg-[#FFB300] flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-black text-lg"></i>
                </div>
                <span>operations@trackpi.in</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showWhatsapp && (
        <a
          href="https://chat.whatsapp.com/E4DcrDNZ3YQBpt8n01Fifv?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 animate-bounce-slow"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp size={26} className="sm:hidden" />
          <FaWhatsapp size={32} className="hidden sm:block" />
        </a>
      )}

      {/* ---------------- FIXED SOCIAL SIDEBAR (LEFT) — public pages only ---------------- */}
      {showSidebar && (
        <div className="hidden sm:flex fixed left-0 bottom-1 flex-col items-start z-50 w-auto">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/trackpi_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[140px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaInstagram size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">INSTAGRAM</span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/people/Trackpi-Private-Limited/61565947096778/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-[#1877F2] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[140px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaFacebookF size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">FACEBOOK</span>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@trackpi"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-[#FF0000] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaYoutube size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">YOUTUBE</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all&viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-[#0A66C2] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaLinkedinIn size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">LINKEDIN</span>
          </a>

          {/* Quora */}
          <a
            href="https://www.quora.com/profile/Trackpi-Private-Limited"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-[#cf2e2e] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[120px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaQuora size={16} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">QUORA</span>
          </a>

          {/* Blogger */}
          <a
            href="https://trackpi.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-[#F57D00] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaBloggerB size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">BLOGGER</span>
          </a>

          {/* Medium */}
          <a
            href="https://medium.com/@trackpi"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[36px] flex items-center bg-black text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[120px] hover:rounded-r-md"
          >
            <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
              <FaMediumM size={18} />
            </div>
            <span className="text-xs font-bold whitespace-nowrap ml-2">MEDIUM</span>
          </a>
        </div>
      )}
    </>
  );
};

export default Footer;
