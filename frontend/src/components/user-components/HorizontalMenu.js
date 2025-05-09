import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HorizontalMenu.css";

const HorizontalMenu = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();

  const handleViewSchedule = () => {
    navigate(`/userSchedule/${subscriptionId}`);
  };

  const handleViewSurvey = () => {
    navigate(`/userSurvey/${subscriptionId}`);
  };

  return (
    <div className="horizontal-menu">
      <ul>
        <li onClick={handleViewSchedule}>Xem lịch trình</li>
        <li onClick={handleViewSurvey}>Xem khảo sát</li>
      </ul>
    </div>
  );
};

export default HorizontalMenu;
