import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

export default function CourseVideoDialog({
  showVideoModal,
  handleCloseVideo,
  videoSrc,
}) {
  return (
    <React.Fragment>
      <Dialog
        maxWidth={"lg"}
        open={showVideoModal}
        onClose={handleCloseVideo}
        aria-labelledby="responsive-dialog-title"
        className="transparent-dialog"
      >
        <DialogContent style={{ overflow: "hidden" }}>
          {videoSrc ? (
            <video controls className="video-player" src={videoSrc} />
          ) : (
            <p>Không có video nào được chọn</p>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
