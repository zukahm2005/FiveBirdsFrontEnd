import React from "react";
import "./fluid1.scss";
import { FaPencil } from "react-icons/fa6";

const Fluid1 = () => {
  return (
    <div className="fluid-container flex-row">
      <div className="content-fluid-container ">
        <div className="content-fluid flex-row">
          <div className="number-heading">
            <p>02.</p>
          </div>
          <div className="heading-content flex-col">
            <div className="title-heading">
              <p>Saving Technologies</p>
            </div>
            <div className="content-middle">
              <p>
                Rem aperiam, eaque ipsa qillo inventore veritatis etquasi
                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                voluptatem quia voluptas sit aspernatur aut odit aut fugit sed
                quia consequuntur magni dolores eos.
              </p>
            </div>
            <div className="list-style">
              <div className="sub-email flex-col">
                <div className="name-email">
                  <p>Subscribe to Our Newsletter:</p>
                </div>
                <div className="input-email">
                  <input type="email" placeholder="Email" />
                  <div>
                    <FaPencil className="icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="img-fluid-container">
        <img
          src="https://html.modernwebtemplates.com/nafta/images/services/service1.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Fluid1;
