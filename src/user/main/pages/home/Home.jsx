import React from "react";
import PageSlide from "./pageSlide/PageSlide";
import ServiceGrid from "./serviceGrid/ServiceGrid";
import Testimonial from "./testimonial/Testimonial";
import Fluid from "./fluid/Fluid";
import Fluid1 from "./fluid1/Fluid1";
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
    </div>
  );
}
