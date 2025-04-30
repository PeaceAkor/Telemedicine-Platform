import React from "react";
import Header from "../components/header";
import SpecilityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecilityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;
