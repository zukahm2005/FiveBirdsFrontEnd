import React from "react";
import { RiMenu3Fill } from "react-icons/ri";
import "./component.scss"
export default function component() {
  return (
    <div className="component-container flex-row">
      <div className="phone-contact">
        <p>800 123 4567</p>
      </div>
      <div className="menu-sidebar">
        <p>
          <RiMenu3Fill />
        </p>
      </div>
    </div>
  );
}
