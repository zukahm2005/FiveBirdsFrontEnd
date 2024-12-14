import React from "react";
import PageSlide from "./pageSlide/PageSlide";
import ServiceGrid from "./serviceGrid/ServiceGrid";
import Testimonial from "./testimonial/Testimonial";

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
    </div>
  );
}
