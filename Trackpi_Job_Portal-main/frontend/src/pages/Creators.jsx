import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/Creators/PageHeader";
import SectionTitle from "../components/Creators/SectionTitle";
import CreatorCard from "../components/Creators/CreatorCards";
import img1 from "../assets/creatorsimages/anjali.png";
import img2 from "../assets/creatorsimages/anshid.png"
import img3 from "../assets/creatorsimages/alan.jpeg";
import img4 from "../assets/creatorsimages/adhy.jpg";
import img5 from "../assets/creatorsimages/hasna.jpeg";
import img6 from "../assets/creatorsimages/dony.jpeg";

const Creators = () => {
  return (
    <>
      <Navbar />
      <PageHeader />

      {/* Designers */}
      <SectionTitle title="Designers" />
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-2 mb-20">
        <CreatorCard
          image={img1}
          name="Anjali Krishna"
          role="UI UX Designer"
        />
        <CreatorCard
          image={img2}
          name="Anshid Rahiman"
          role="UI UX Designer"
        />
      </div>

      {/* Developers */}
      <SectionTitle title="Developers" />
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 
      sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-5 lg:gap-4 mb-24">

        <CreatorCard
          image={img3}
          name="Alan Joy Wilson"
          role="MERN Stack Developer"
        />
        <CreatorCard
          image={img4}
          name="Adhy Krishna V S"
          role="MERN Stack Developer"
        />
        <CreatorCard
          image={img5}
          name="Hasna K K"
          role="MERN Stack Developer"
        />
        <CreatorCard
          image={img6}
          name="Dony Biji"
          role="MERN Stack Developer"
        />

      </div>

      <Footer />
    </>
  );
};

export default Creators;
