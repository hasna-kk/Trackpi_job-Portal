import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, totalResults, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const startResult = (currentPage - 1) * itemsPerPage + 1;
    const endResult = Math.min(currentPage * itemsPerPage, totalResults);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30 gap-4">
            <div className="text-sm text-gray-500 font-medium">
                Showing <span className="text-gray-900">{startResult}</span> to <span className="text-gray-900">{endResult}</span> of <span className="text-gray-900">{totalResults}</span> results
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-bold rounded-lg border transition ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-white'}`}
                >
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition ${currentPage === page ? 'bg-[#FFB300] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                            return <span key={page} className="px-1 text-gray-400">...</span>;
                        }
                        return null;
                    })}
                </div>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-bold rounded-lg border transition ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
