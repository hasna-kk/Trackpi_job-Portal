import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutHero from "../components/AboutUs/AboutHero";
import WhyChoose from "../components/AboutUs/WhyChoose";
import WhoWeAre from "../components/AboutUs/WhoWeAre";
import MissionVision from "../components/AboutUs/MissionVision";
import OurPeople from "../components/AboutUs/OurPeople";
import Team from "../components/AboutUs/Team";
import JoinOurTeam from "../components/AboutUs/JoinOurTeam";
import WhoWeAreTitle from "../components/AboutUs/WhoWeAreTitle";


const About = () => {
  return (
    <div className="relative overflow-x-hidden">
      <Navbar mode="public" />

      <AboutHero />
      <WhyChoose />
      <WhoWeAreTitle />
      <WhoWeAre />
      <MissionVision />
      <OurPeople />
      <Team />
      <JoinOurTeam />

      <Footer />
    </div>
  );
};

export default About;
