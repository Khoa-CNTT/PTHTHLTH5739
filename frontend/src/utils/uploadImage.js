import axios from "axios";

// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file) => {
  const CLOUDINARY_CLOUD_NAME = "du0qsvpac";
  const CLOUDINARY_UPLOAD_PRESET = "uploadfitzone";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Lấy từ biến môi trường
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME); // Lấy từ biến môi trường

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.url; // Trả về URL của ảnh sau khi upload
  } catch (error) {
    throw new Error("Lỗi khi tải ảnh lên Cloudinary");
  }
};
export const uploadVideoToCloudinary = async (file) => {
  const CLOUDINARY_CLOUD_NAME = "dpucib9ge";
  const CLOUDINARY_UPLOAD_PRESET = "gzcgsk2j";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Lấy từ biến môi trường
  formData.append("cloud_name", CLOUDINARY_CLOUD_NAME); // Lấy từ biến môi trường

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      formData
    );
    return response.data.url; // Trả về URL của ảnh sau khi upload
  } catch (error) {
    throw new Error("Lỗi khi tải ảnh lên Cloudinary");
  }
};
