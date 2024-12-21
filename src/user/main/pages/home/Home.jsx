import React from "react";
import Fluid from "./fluid/Fluid";
import Fluid1 from "./fluid1/Fluid1";
import Fluid2 from "./fluid2/Fluid2";
import PageSlide from "./pageSlide/PageSlide";
import ServiceGrid from "./serviceGrid/ServiceGrid";
import Testimonial from "./testimonial/Testimonial";
import OurProject from "./ourProject/OurProject";
export default function Home() {
  return (
    <div>
      <div>
        <PageSlide />
      </div>
      <div>
        <ServiceGrid/>
      </div>
      <div>
        <Testimonial/>
      </div>
      <div>
        <Fluid/>
      </div>
      <div>
        <Fluid1/>
      </div>
      <div>
        <Fluid2/>
      </div>
      <div>
        <OurProject/>
      </div>
    </div>
  );
}
