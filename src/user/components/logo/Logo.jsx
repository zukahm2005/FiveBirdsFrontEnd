import React from "react";
import img from "../../../common/img/image.png"
import "./logo.scss"
export default function Logo() {
  return (
    <div className="logo-container flex-row">
      <div className="img-logo">
        <img src={img} alt="" />
      </div>
      <div className="content-logo flex-col">
        <div className="top-content">
          <p>nafta</p>
        </div>
        <div className="bottom-content">
          <p>OIL & GAS INDUSTRY</p>
        </div>
      </div>
    </div>
  );
}
