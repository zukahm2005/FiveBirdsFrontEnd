import React, { useState } from "react";
import { motion } from "framer-motion";
import "./faq.scss";
import { IoIosArrowForward } from "react-icons/io";

const FAQ = () => {
  const questions = [
    {
      id: 1,
      title: "How can I submit my CV?",
      content:
        "ou can submit your CV directly through our website by clicking the (Apply Now) button on the homepage or in the recruitment section. Accepted CV formats include PDF and Word.",
    },
    {
      id: 2,
      title: "Do I need to take an online test?",
      content:
        "Yes. After submitting your CV, you will receive an email with detailed instructions to take the online test. This test helps us assess your skills and suitability for the position.",
    },
    {
      id: 3,
      title:
        "How long does it take to receive feedback after submitting my CV?",
      content:
        "Typically, we respond within 5-7 business days. If you qualify, you will be invited to take the test or proceed to the next interview round.",
    },
    {
      id: 4,
      title: "Can I edit or update my submitted CV?",
      content:
        "Yes. You can email our HR department with your updated CV, along with the details of the position you applied for.",
    },
    {
      id: 5,
      title:
        "Who can I contact if I have additional questions about recruitment?",
      content:
        "You can contact us directly through the (Contact Us) section on our website or email us at recruitment@company.com for assistance.",
    },
  ];

  const icons = [
    {
      id: 1,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/01.png",
    },
    {
      id: 2,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/02.png",
    },
    {
      id: 3,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/03.png",
    },
    {
      id: 4,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/04.png",
    },
    {
      id: 5,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/05.png",
    },
    {
      id: 6,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/06.png",
    },
    {
      id: 7,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/07.png",
    },
    {
      id: 8,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/08.png",
    },
    {
      id: 9,
      icon: "https://html.modernwebtemplates.com/nafta/images/partners/09.png",
    },
  ];
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="faq-container ">
      <div className="faq-content flex-row">
        <div className="left-faq flex-col">
          <div className="title-faq">
            <p>FAQ & Information</p>
          </div>
          <div className="faq-list flex-col">
            {questions.map((q) => (
              <div
                key={q.id}
                className="faq-item"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="faq-title flex-row">
                  <p className="title">{q.title}</p>
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: expandedId === q.id ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <IoIosArrowForward className="icon" />
                  </motion.span>
                </div>
                {expandedId === q.id && <p className="content">{q.content}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="right-faq">
          <div className="icon-container">
            {icons.map((icon) => (
              <img key={icon.id} src={icon.icon} alt={`Icon ${icon.id}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
