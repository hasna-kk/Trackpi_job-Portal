import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TestimonialRow({
  name,
  jobTitle,
  coverImageUrl,
  thumbnailImageUrl,
  videoUrl,
  about,
  isReversed
}) {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-6 pb-10 border-b`}>
      {/* LEFT CARD */}
      <div className="relative w-full sm:w-72 h-[420px] rounded-3xl overflow-hidden shrink-0">
        {/* IMAGE */}
        <img
          src={coverImageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* TEXT (BOTTOM LEFT ON IMAGE) */}
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-300">{jobTitle}</p>
        </div>

        {/* PLAY BUTTON (FLOATING) */}
        <button
          onClick={() => setPlayVideo(true)}
          className="absolute bottom-6 right-6 bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        >
          <span className="text-yellow-500 text-xl ml-1">▶</span>
        </button>
      </div>

      {/* VIDEO + TEXT */}
      <div className="flex-1 w-full flex flex-col justify-center">
        <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-black shadow-xl">
          {!playVideo ? (
            <>
              <img
                src={thumbnailImageUrl}
                className="w-full h-full object-cover opacity-80"
                alt="Video Preview"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <button
                onClick={() => setPlayVideo(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="bg-white/90 w-16 h-16 rounded-full flex items-center justify-center text-3xl text-yellow-500 pl-1 group-hover:scale-110 transition-transform shadow-lg">
                  ▶
                </div>
              </button>
            </>
          ) : (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          )}
        </div>

        <div className="mt-3 text-left">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-['Lato'] font-[800] text-[28px] leading-[1.6] text-black">
              {name}
            </h3>
            <span className="font-['Lato'] font-[600] text-[14px] leading-[1.6] text-black">
              {jobTitle}
            </span>
          </div>
          <div className="font-['Lato'] font-[700] text-[14px] leading-[1.6] text-black max-w-[843px]">{about}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Ensure we send numbers to the backend
    fetch(`/api/testimonials?page=${currentPage}&limit=4`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.testimonials || []);
          setTotalPages(data.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => {
        setTestimonials([]);
        setLoading(false);
      });
  }, [currentPage]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="text-center pt-32 pb-20 bg-gray-50">
        <h1 className="text-5xl font-bold mb-4">
          What <span className="text-yellow-500">Our</span> Candidates Say
        </h1>
        <p className="text-gray-500 text-xl max-w-2xl mx-auto">
          Hear from people who trusted our design solutions and transformed their careers.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {testimonials.length > 0 ? (
          testimonials.map((item, index) => (
            <TestimonialRow
              key={item._id}
              name={item.name}
              jobTitle={item.jobTitle}
              coverImageUrl={item.coverImage?.url}
              thumbnailImageUrl={item.thumbnailImage?.url}
              videoUrl={item.video?.url}
              about={item.about}
              isReversed={index % 2 !== 0}
            />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 text-xl">
            No testimonials available yet.
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mb-20">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border 
            border-gray-300 hover:border-yellow-500 hover:text-yellow-500 text-3xl 
            font-bold disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-black transition-colors"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors font-medium
                ${currentPage === i + 1
                  ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                  : "border border-gray-300 hover:border-yellow-500 hover:text-yellow-500"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-yellow-500
             hover:text-yellow-500 text-3xl disabled:opacity-30 font-bold
            disabled:hover:border-gray-300 disabled:hover:text-gray-400 transition-colors"
          >
            ›
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
