const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const next = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-[23px] mt-8">
      {/* Previous Arrow */}
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center text-black hover:text-[#FFB300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="ri-arrow-left-s-line text-2xl font-bold"></i>
      </button>

      {/* Numbers */}
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`
            w-8 h-8 flex items-center justify-center rounded-[4px] text-sm font-bold transition-all
            ${currentPage === i + 1
              ? "bg-[#FFB300] text-black"
              : "bg-black text-white hover:bg-[#333333]"
            }
          `}
        >
          {i + 1}
        </button>
      ))}

      {/* Next Arrow */}
      <button
        onClick={next}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center text-black hover:text-[#FFB300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="ri-arrow-right-s-line text-2xl font-bold"></i>
      </button>
    </div>
  );
};

export default Pagination;
