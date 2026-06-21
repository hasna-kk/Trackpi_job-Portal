import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import HowToGetHired from "../components/home/HowToGetHired";

// Below-fold sections loaded lazily — they don't block initial paint
const Stats = lazy(() => import("../components/home/Stats"));
const Partners = lazy(() => import("../components/home/Partners"));
const JobSection = lazy(() => import("../components/home/JobSection"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  return (
    <div className="font-poppins">
      {/* Above-fold: loads immediately */}
      <Navbar mode="public" />
      <Hero />
      <HowToGetHired />

      {/* Below-fold: loads lazily after initial paint */}
      <Suspense fallback={null}>
        <Stats />
        <Partners />
        <JobSection isHome={true} />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;

