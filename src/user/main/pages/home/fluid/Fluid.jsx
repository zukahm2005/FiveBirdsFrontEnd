import React from "react";
import "./fluid.scss";
import { FaCheck } from "react-icons/fa6";import { LuDot } from "react-icons/lu";

const Fluid = () => {
  return (
    <div className="fluid-container flex-row">
      <div className="img-fluid-container">
        <img
          src="https://html.modernwebtemplates.com/nafta/images/services/service1.jpg"
          alt=""
        />
      </div>

      <div className="content-fluid-container ">
        <div className="content-fluid flex-row">
          <div className="number-heading">
            <p>01.</p>
          </div>
          <div className="heading-content flex-col">
            <div className="title-heading">
              <p>Chemical Industry</p>
            </div>{" "}
            <div className="content-middle">
              <p>
                Cillum doloreu fugiat nulla pariatur excepteur si occaecat
                cupdatat non proident sunt culpaq officia deserunt mollt animest
                laborum sed perspiciatis unde omnis iste natus errosit
                voluptatem accuantium doloremque laudantium totam.
              </p>
            </div>
            <div className="list-style">
              <ul>
                <li>
                  <FaCheck className="icon" />
                  <p> Laudantium, totam rem aperiam</p>
                </li>
                <li>
                  <FaCheck className="icon" />
                  <p> Eaque ipsa quae ab illo inventore veritatis</p>{" "}
                </li>
                <li>
                  
                  <FaCheck className="icon" />
                  <p> Quasi architecto beatae</p>{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fluid;
