import React from "react";
import Navbar from "./Navbar";
import Services from "./Services";
import Cards from "./Cards";
import Newsection from "./Newsection";
import Footer from "./Footer";
import Hero from "./Hero";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Services />
      <Hero/>
      <Cards />
      <Newsection />
      <Footer />
    </div>
  );
};

export default Home;
