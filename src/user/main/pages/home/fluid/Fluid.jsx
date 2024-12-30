import React from "react";
import "./fluid.scss";
import { FaCheck } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";

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
                The chemical industry plays a pivotal role in driving global
                economic development. Here, you will engage in advanced research
                and production projects, contributing to innovative and
                sustainable solutions. This is your opportunity to work in a
                modern environment alongside experienced experts with
                international influence. Join us today to unlock your potential
                and help us build a sustainable future together.
              </p>
            </div>
            <div className="list-style">
              <ul>
                <li>
                  <FaCheck className="icon" />
                  <p>
                    {" "}
                    Participate in cutting-edge chemical technology projects
                  </p>
                </li>
                <li>
                  <FaCheck className="icon" />
                  <p> Collaborate with top experts in the industry.</p>{" "}
                </li>
                <li>
                  <FaCheck className="icon" />
                  <p>
                    {" "}
                    Advance your career in a dynamic and international
                    environment.
                  </p>{" "}
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
