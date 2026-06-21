import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
    return (
        <div className="font-poppins">
            <Navbar mode="public" />
            <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-12 md:py-20">
                <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>

                <div className="prose max-w-none text-gray-700">
                    <p className="mb-4">
                        Welcome to TrackPi. By accessing our website, you agree to be bound by these terms and conditions,
                        all applicable laws and regulations, and agree that you are responsible for compliance with any
                        applicable local laws.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use License</h2>
                    <p className="mb-4">
                        Permission is granted to temporarily download one copy of the materials (information or software)
                        on TrackPi's website for personal, non-commercial transitory viewing only.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Disclaimer</h2>
                    <p className="mb-4">
                        The materials on TrackPi's website are provided on an 'as is' basis. TrackPi makes no warranties,
                        expressed or implied, and hereby disclaims and negates all other warranties including, without
                        limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
                        or non-infringement of intellectual property or other violation of rights.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Limitations</h2>
                    <p className="mb-4">
                        In no event shall TrackPi or its suppliers be liable for any damages (including, without limitation,
                        damages for loss of data or profit, or due to business interruption) arising out of the use or
                        inability to use the materials on TrackPi's website.
                    </p>

                    <p className="mt-12 text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
