import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FaLock } from "react-icons/fa"; // Import biểu tượng khóa
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export default function AccordionExpandIcon({ workout, handleOpenVideo }) {
  return (
    <div>
      {workout && workout.length > 0 ? (
        workout.map((workoutItem, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              className="accordion-summary"
            >
              <div className="summary-content">
                <Typography>
                  {workoutItem?.name || "No workout name provided"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ngày:{" "}
                  {workoutItem.date
                    ? new Date(workoutItem.date).toLocaleDateString()
                    : "No date provided"}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {workoutItem?.progressId &&
                workoutItem.progressId.length > 0 ? (
                  workoutItem.progressId.map((progress, idx) => {
                    const exercise = progress.exerciseId;
                    return (
                      <div key={idx} className="exercise-section">
                        {index === 0 && exercise?.video && (
                          <PlayCircleOutlineIcon
                            className="play-icon"
                            onClick={() => handleOpenVideo(exercise.video)}
                          />
                        )}
                        <Typography
                          variant="subtitle1"
                          className="exercise-name"
                        >
                          {exercise?.name || "No exercise name"}
                        </Typography>
                        {!exercise?.video && (
                          <FaLock className="lock-icon" title="Video locked" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <Typography>
                    Không có bài tập nào cho buổi tập luyện này.
                  </Typography>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>Không có bài tập nào có sẵn.</Typography>
      )}
    </div>
  );
}
