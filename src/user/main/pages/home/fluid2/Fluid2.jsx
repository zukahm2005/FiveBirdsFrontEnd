import React, { useEffect, useState } from "react";
import "./fluid2.scss";
import { CiPlay1 } from "react-icons/ci";
import { motion } from "framer-motion";

const Fluid2 = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date("2025-02-01T00:00:00");
        const now = new Date();
        const difference = targetDate - now;

        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái cho popup

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePlayClick = () => {
        setIsPopupOpen(true); // Mở popup
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // Đóng popup
    };

    return (
        <div className="fluid-container flex-row">
            <div className="img-fluid-container">
                <img
                    src="https://html.modernwebtemplates.com/nafta/images/services/service3.jpg"
                    alt=""
                />
                <div className="play-button" onClick={handlePlayClick}>
                    <motion.div
                        className="pulse-circle"
                        initial={{ scale: 1, opacity: 0.3 }}
                        animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                        transition={{
                            duration: 1.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="play-button-inner"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <p>
                            <CiPlay1 />
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Popup Video */}
            {isPopupOpen && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/GhthHC0s38A"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                     
                    </div>
                </div>
            )}

            <div className="content-fluid-container">
                <div className="content-fluid flex-row">
                    <div className="number-heading">
                        <p>03.</p>
                    </div>
                    <div className="heading-content flex-col">
                        <div className="title-heading">
                            <p>Military Industry</p>
                        </div>
                        <div className="content-middle">
                            <p>
                                Qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                                qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                                sed quia non numquam. Watch our presentation:
                            </p>
                        </div>
                        <div className="list-style flex-row">
                            <div className="countdown-box">
                                <div className="countdown1">
                                    <span>
                                        <div className="number-count1">{timeLeft.days}</div>
                                    </span>
                                    <p>Days</p>
                                </div>
                            </div>
                            <div className="countdown-box">
                                <div className="countdown">
                                    <span className="number-count">
                                        <div className="number-count">{timeLeft.hours}</div>
                                    </span>
                                    <p>Hours</p>
                                </div>
                            </div>
                            <div className="countdown-box">
                                <div className="countdown">
                                    <span className="number-count">
                                        <div className="number-count">{timeLeft.minutes}</div>
                                    </span>
                                    <p>Minutes</p>
                                </div>
                            </div>
                            <div className="countdown-box">
                                <div className="countdown">
                                    <span className="number-count">
                                        <div className="number-count">{timeLeft.seconds}</div>
                                    </span>
                                    <p>Seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Fluid2;
