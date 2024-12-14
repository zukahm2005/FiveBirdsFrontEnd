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
              <p>Get A Quote</p>
            </button>
          </div>
        </div>
        <div className="center-content-timonial flex-col">
          <div className="desc-top">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore.
            </p>
          </div>
          <div className="desc-bottom">
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum doloreu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              animest laborum sed ut perspiciatis unde omnis iste natus error
              sit voluptatem accusantium doloremque.
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
