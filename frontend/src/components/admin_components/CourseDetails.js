// CourseDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";
import { Visibility as EyeIcon, Close as CloseIcon } from "@mui/icons-material";
import WorkoutModal from "./WorkoutModal";
import { toast, ToastContainer } from "react-toastify";

const CourseDetails = ({ selectedCourse, onClose }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  // Fetch course data
  const fetchCourseData = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/admins/courses/${selectedCourse._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourse(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khóa học", error);
      toast.error("Lỗi khi tải dữ liệu khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [selectedCourse]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setIsModalVisible(true);
  };

  return (

    <Box padding={3} display="flex" justifyContent="center">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Card
        sx={{
          width: 1200,
          height: 500,
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Nút Đóng */}
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            ":hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {/* Hình ảnh bên trái */}
        <CardMedia
          component="img"
          sx={{ width: 400 }}
          image={course.image[0] || "default-image-url"}
          alt={course.name}
        />

        {/*Tab Thông tin khóa học và Tab bài tập */}
        <CardContent sx={{ flex: 1, paddingLeft: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {course.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {course.description && (
              <div dangerouslySetInnerHTML={{ __html: course.description }} />
            )}
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            sx={{ marginBottom: 2 }}
          >
            <Tab label="Thông tin khóa học" />
            <Tab label="Bài tập luyện" />
          </Tabs>

          {tabIndex === 0 && (
            <Box>
              <Typography variant="h6">Giá khóa học: {course.price}</Typography>
              <Typography variant="h6">Thể loại: {course.category}</Typography>
              <Typography variant="h6">Số lượng bài tập: {course.slotNumber}</Typography>
            </Box>
          )}

          {tabIndex === 1 && (
            <List>
              {course.workout.map((item) => (
                <ListItem
                  key={item._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleEditWorkout(item)}
                    >
                      <EyeIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`Date: ${new Date(
                      item.date
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Modal bài tập */}
      <WorkoutModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        currentWorkout={currentWorkout}
        setCurrentWorkout={setCurrentWorkout}
      />
    </Box>
  );
};

export default CourseDetails;
