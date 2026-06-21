import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TestimonialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/admin/testimonials/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error();

        setTestimonial(json.data);
      } catch {
        toast.error("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [id, token]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!testimonial) return null;

  /* ================= UI ================= */
  return (
    <div
      className="bg-white rounded-lg shadow-sm"
      style={{
        width: "1100px",
        height: "715.9392700195312px",
        position: "absolute",
        top: "53px",
        left: "247px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "32px 40px",
        gap: "20px",
        opacity: "1",
        transform: "rotate(0deg)",
        overflow: "hidden"
      }}
    >
      <h1 className="text-3xl font-bold text-gray-900 leading-none">
        Testimonials
      </h1>

      {/* NAME & JOB TITLE WRAPPER */}
      <div
        style={{
          width: "971.2646484375px",
          height: "145px",
          display: "flex",
          flexDirection: "column",
          gap: "33px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        {/* NAME */}
        <div>
          <label className="block text-sm mb-1 font-medium">Name</label>
          <div className="border-b py-2 w-full">{testimonial.name}</div>
        </div>

        {/* JOB TITLE */}
        <div>
          <label className="block text-sm mb-1 font-medium">Job title</label>
          <div className="border-b py-2 w-full">{testimonial.jobTitle}</div>
        </div>
      </div>

      {/* ABOUT WRAPPER */}
      <div
        style={{
          width: "964px",
          height: "150px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <label className="text-sm pt-2 font-medium">About your experience</label>
        <div
          className="border p-4 w-full h-full text-gray-600 whitespace-pre-wrap overflow-y-auto"
          style={{ borderRadius: "10px", borderWidth: "1px" }}
        >
          {testimonial.about}
        </div>
      </div>

      {/* MEDIA WRAPPER */}
      <div
        style={{
          width: "964px",
          height: "189px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          opacity: "1",
          transform: "rotate(0deg)"
        }}
      >
        <div className="flex gap-[15px] h-full">
          <MediaBox
            preview={testimonial.coverImage?.url}
            label="Cover image"
            style={{ width: "208px", height: "189px" }}
          />

          <MediaBox
            preview={testimonial.thumbnailImage?.url}
            label="Thumbnail cover image"
            style={{ width: "208px", height: "189px" }}
          />

          <MediaBox
            preview={testimonial.video?.url}
            label="Video Testimonial"
            isVideo
            style={{ width: "496px", height: "189px" }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ width: "964px" }}
      >
        <button
          type="button"
          onClick={() => navigate("/admin/testimonials")}
          className="text-orange-500 hover:text-black font-medium"
        >
          &larr; Back to list
        </button>

        <button
          type="button"
          onClick={() => navigate(`/admin/testimonials/edit/${id}`)}
          className="bg-yellow-500 text-white px-10 py-3 rounded-lg font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

/* ================= MEDIA BOX ================= */
const MediaBox = ({ preview, label, isVideo, style }) => (
  <div
    className="relative rounded-2xl overflow-hidden bg-gray-800"
    style={style}
  >
    {preview &&
      (isVideo ? (
        <video src={preview} controls className="w-full h-full object-cover" />
      ) : (
        <img src={preview} alt={label} className="w-full h-full object-fill" />
      ))}

    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
      <span className="text-yellow-400 font-medium flex items-center gap-2">
        {label}
        <span className="text-xl">⬆</span>
      </span>
    </div>
  </div>
);

export default TestimonialDetails;
