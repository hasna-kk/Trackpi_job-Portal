import React from "react";
import Navbar from "../components/Navbar";
import JobSection from "../components/home/JobSection";
import Footer from "../components/Footer";

const BrowseJobs = () => {
    return (
        <div className="font-poppins flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
                <JobSection className="pb-16" showBack={false} />
            </main>
            <Footer />
        </div>
    );
};

export default BrowseJobs;
