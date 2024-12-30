import React from "react";
import "./testimonial.scss";
const Testimonial = () => {
  return (
    <div className="timonial-container ">
      <div className="timonial-main flex-row">
        <div className="left-content-timonial">
          <div className="title-timonial">
            <p>Welcome!</p>
          </div>
          <div className="button-timonial">
            <button>
              <p>Apply Now</p>
            </button>
          </div>
        </div>
        <div className="center-content-timonial flex-col">
          <div className="desc-top">
            <p>Welcome to Global Career Opportunities</p>
          </div>
          <div className="desc-bottom">
            <p>
              At Nafta, we don’t just offer jobs—we build careers. With a
              professional work environment, opportunities for growth, and
              exciting challenges, you’ll discover your full potential. Submit
              your CV today and start your new career journey with us!
            </p>
          </div>
        </div>
        <div className="right-content-timonial flex-row">
          <div className="avatar">
            <img
              src="https://html.modernwebtemplates.com/nafta/images/team/testimonial2.jpg"
              alt=""
            />
          </div>
          <div className="name flex-col">
            <div>
              <p>Diana T.Davis</p>
            </div>
            <div>
              <img
                src="https://html.modernwebtemplates.com/nafta/images/signature.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
