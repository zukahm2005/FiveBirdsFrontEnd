import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./pageSlide.scss";

const PageSlide = () => {
  const slides = [
    {
      id: 1,
      image: "https://html.modernwebtemplates.com/nafta/images/slide01.jpg",
      alt: "Slide 1",
      title: "Vital Oil & Natural Gas",
      subtitle: "01. PROVIDING FOR TODAY",
    },
    {
      id: 2,
      image: "https://html.modernwebtemplates.com/nafta/images/slide02.jpg",
      alt: "Slide 2",
      title: "Know How Solutions",
      subtitle: "02. INNOVATIONS",
    },
    {
      id: 3,
      image: "https://html.modernwebtemplates.com/nafta/images/slide03.jpg",
      alt: "Slide 3",
      title: "Energy & Commodities",
      subtitle: "03. INDUSTRY",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(1);

  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `
              <div class="${className}">
                <span class="pagination-bullet-number ${
                  index + 1 === currentSlide ? "active" : ""
                }">${index + 1}/${slides.length}</span>
              </div>
            `;
          },
        }}
        autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.image}
              alt={slide.alt}
              style={{ width: "100%", height: "100%" }}
            />
            <div className="bubble-animation">
              <div className="content flex-col">
                <div className="subtitle">
                  <h4>{slide.subtitle}</h4>
                </div>
                <div className="title">
                  <p>{slide.title}</p>
                </div>
                <div className="buttons flex-row">
                  <div>
                    <button><p>Get A Quote</p></button>
                  </div>
                  <span>
                   or
                  </span>
                  <div>
                    <p>Request A Callback</p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PageSlide;
