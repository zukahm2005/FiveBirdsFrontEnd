import React from "react";
import "./serviceGrid.scss";
import { IoIosArrowForward } from "react-icons/io";

// Import ảnh
import img1 from "../../../../../common/img/1.png";
import img2 from "../../../../../common/img/2.png";
import img3 from "../../../../../common/img/3.png";
import img7 from "../../../../../common/img/7.png";
import img5 from "../../../../../common/img/5.png";
import img6 from "../../../../../common/img/6.png";

const services = [
  {
    id: 1,
    icon: img1,
    title: "Thermal Power",
    description: "Contribute to sustainable energy solutions",
  },
  {
    id: 2,
    icon: img2,
    title: "Oil Platform",
    description: "Explore opportunities on modern oil platforms",
  },
  {
    id: 3,
    icon: img3,
    title: "Gas Flaring",
    description: "Reduce emissions and protect the environment",
  },
  {
    id: 4,
    icon: img7,
    title: "Oil Pump",
    description: "Operate advanced oil pump systems",
  },
  {
    id: 5,
    icon: img5,
    title: "Oil Refinery",
    description: "Refine oil into high-quality products.",
  },
  {
    id: 6,
    icon: img6,
    title: "Factory",
    description: "Build sustainable infrastructure collaboratively",
  },
];

const colors = [
  "rgb(4, 43, 61)",
  "rgb(5, 48, 66)",
  "rgb(6, 54, 74)",
  "rgb(7, 59, 79)",
  "rgb(8, 63, 84)",
  "rgb(9, 68, 89)",
];

const ServiceGrid = () => {
  return (
    <div className="service-grid">
      {services.map((service, index) => (
        <div
          className="service-card-container flex-col"
          key={service.id}
          style={{ backgroundColor: colors[index % colors.length] }}
        >
          <div className="icon">
            <img
              src={service.icon}
              alt={service.title}
              className="service-icon"
            />
          </div>

          <div className="title-service-card">
            <p>{service.title}</p>
          </div>
          <div className="dash-card"></div>
          <div className="description-card">
            <p>{service.description}</p>
          </div>
          <div className="action-card">
            <p>
              <IoIosArrowForward />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;
