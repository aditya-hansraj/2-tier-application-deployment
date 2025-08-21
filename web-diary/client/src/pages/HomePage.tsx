import React from "react";
import { TabContainer } from "react-bootstrap";
import HeroSection from "../components/Home/HeroSection";
import Features from "../components/Home/Features";

const HomePage: React.FC = () => {
  return (
    <TabContainer>
      <HeroSection />
      <Features />
    </TabContainer>
  );
};

export default HomePage;
