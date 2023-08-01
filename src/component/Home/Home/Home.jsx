import React from "react";
import About from "../About/About";

import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

import Header from "../Header/Header";

import ScrollTop from "../../Shared/ScrollTop/ScrollTop";

const Home = () => {
  return (
    <main>
      <Header />

      <About />

      <Contact />
      <Footer />
      <ScrollTop />
    </main>
  );
};

export default Home;
