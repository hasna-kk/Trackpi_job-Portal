import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Star, ArrowLeft, Edit, Trash2, Calendar, Play } from "lucide-react";

const CompetitionTestimonialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competition-testimonials/admin/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || "Failed to load details");

        setTestimonial(data.data || data);
      } catch (error) {
        toast.error(error.message || "Failed to load details");
        navigate("/admin/competition/testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  if (!testimonial) return null;

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-white min-h-screen max-w-6xl mx-auto rounded-3xl shadow-sm border border-gray-100 mb-10 mt-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b pb-8 border-gray-50">
        <div className="flex items-center gap-6">
            <button 
                onClick={() => navigate("/admin/competition/testimonials")}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
                title="Back to List"
            >
                <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{testimonial.name}</h1>
                <p className="text-yellow-600 font-bold uppercase tracking-widest text-xs mt-1">{testimonial.jobTitle}</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button
                onClick={() => navigate(`/admin/competition/testimonials/edit/${testimonial._id}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-50 text-yellow-700 font-bold hover:bg-yellow-100 transition-colors border border-yellow-200/50 shadow-sm"
            >
                <Edit size={18} /> Edit Story
            </button>
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-500 font-bold border border-gray-200/50">
                <Calendar size={18} /> {new Date(testimonial.createdAt).toLocaleDateString()}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: Testimonial Story */}
        <div className="lg:col-span-7 space-y-10">
            {/* RATING */}
            <div className="bg-yellow-50/30 p-6 rounded-3xl border border-yellow-100 inline-block">
                <label className="block text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-3">Overall Rating</label>
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                            key={s}
                            size={20}
                            className={`${s <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                        />
                    ))}
                    <span className="ml-3 font-black text-yellow-600">{testimonial.rating}/5</span>
                </div>
            </div>

            {/* ABOUT */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Testimonial Story</label>
                <div className="bg-gray-50/50 rounded-3xl p-10 border border-gray-100 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-8 left-8 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-3H4c-1.25 0-2 1-2 2v2c0 1.25.75 2.017 2 3H2c.333 0 1 .667 1 2V21zM14 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-3h-4c-1.25 0-2 1-2 2v2c0 1.25.75 2.017 2 3h-2c.333 0 1 .667 1 2V21z" /></svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic text-xl font-raleway z-10 relative">
                        "{testimonial.about}"
                    </p>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Media */}
        <div className="lg:col-span-5 space-y-8">
            {/* COVER IMAGE */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cover Image</label>
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-video bg-gray-100 group">
                    <img 
                        src={testimonial.coverImage?.url} 
                        alt="Cover" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            </div>

            {/* VIDEO PLAYER */}
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Video Testimonial</label>
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/3] bg-black relative group">
                    <video 
                        src={testimonial.video?.url} 
                        className="w-full h-full object-cover opacity-90"
                        controls
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-black/60 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-bold flex items-center gap-2">
                             <Play size={14} className="fill-white" /> High-Quality Video Preview
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionTestimonialDetails;
