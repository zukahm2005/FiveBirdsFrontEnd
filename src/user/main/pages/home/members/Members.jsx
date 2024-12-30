import React from "react";
import "swiper/css"; // Import Swiper core styles
import "swiper/css/autoplay"; // Import CSS cho autoplay
import { Swiper, SwiperSlide } from "swiper/react";
import "./members.scss";

const Members = () => {
  const membersImg = [
    {
      id: 1,
      img: "https://html.modernwebtemplates.com/nafta/images/team/01.png",
      name: "Roger J. Watkins",
      role: "President",
    },
    {
      id: 2,
      img: "https://html.modernwebtemplates.com/nafta/images/team/02.png",
      name: "Anita J. Harker",
      role: "CEO",
    },
    {
      id: 3,
      img: "https://html.modernwebtemplates.com/nafta/images/team/03.png",
      name: "Harold K. Cave",
      role: "Coordinator",
    },
    {
      id: 4,
      img: "https://html.modernwebtemplates.com/nafta/images/team/04.png",
      name: "Alex M. Richardson",
      role: "CEO",
    },
    {
      id: 5,
      img: "https://html.modernwebtemplates.com/nafta/images/team/05.png",
      name: "Tajana N. Emmett",
      role: "Accountant",
    },
    {
      id: 6,
      img: "https://html.modernwebtemplates.com/nafta/images/team/06.png",
      name: "Justine E. Inger",
      role: "Manager",
    },
  ];

  return (
    <div className="members-container flex-col">
      <div className="title-members flex-col">
        <div className="title">
          <p>Our Team</p>
        </div>
        <div className="content">
          <p>
            Behind the company’s success is a team of experienced and passionate
            leaders. Each of them brings in-depth knowledge, exceptional
            leadership skills, and a strong commitment to our mission. Let’s
            meet the outstanding individuals who are shaping the future of our
            organization.
          </p>
        </div>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="members-swiper"
      >
        {membersImg.map((member) => (
          <SwiperSlide key={member.id}>
            <div className="member-card">
              <img src={member.img} alt={member.name} className="member-img" />

              <div className="info-members flex-row">
                <p className="member-name">{member.name}</p>
                <p className="member-role">{member.role}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Members;
