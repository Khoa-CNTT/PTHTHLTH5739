import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { LeftOutlined } from "@ant-design/icons";

function PreviewUserWorkout() {
	const { subscriptionId } = useParams();
	const [workouts, setWorkouts] = useState([]);
	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const [adviceList, setAdviceList] = useState([]); // Store advice data
	const [currentAdvice, setCurrentAdvice] = useState(''); // Display matched advice
	const [advice, setAdvice] = useState('');
	const [timestamp, setTimestamp] = useState(0); // Track timestamp in whole seconds
	const [isCoach, setIsCoach] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const navigate = useNavigate();


	// Function to calculate progress percentage
	const calculateProgressPercentage = (progressIds) => {
		const completedProgress = progressIds.filter((progress) => progress.completionRate === 'true').length;
		const totalProgress = progressIds.length;
		return totalProgress > 0 ? ((completedProgress / totalProgress) * 100).toFixed(2) : 0;
	};

	useEffect(() => {
		const role = localStorage.getItem("role");
		setIsCoach(role === "coach");
		fetchWorkouts();
	}, []);

	const fetchWorkouts = async () => {
		try {
			const response = await axios.get(
				`http://localhost:4000/api/coaches/preview/${subscriptionId}/`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setWorkouts(response.data.data);
		} catch (error) {
			console.error("Error fetching workout videos:", error);
			toast.error("Failed to fetch workout videos. Please try again.");
		}
	};

	const handleAdviceByTimestamp = (time) => {
		const matchingAdvice = adviceList.find((adv) => adv.timestamp === time);
		setAdvice(matchingAdvice ? matchingAdvice.advice : '');
		setTimestamp(time);
	};

	const handleWorkoutClick = async (workout) => {
		setSelectedWorkout(workout);
		try {
			const response = await axios.get(
				`http://localhost:4000/api/coaches/preview/${subscriptionId}/${workout._id}/advice`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			setAdviceList(response.data.advice);
		} catch (error) {
			console.error('Error fetching advice:', error);
			toast.error('Failed to fetch advice. Please try again.');
		}
		setShowPopup(true);
	};



	// Function to handle saving advice (PUT request)
	const handleSaveAdvice = async () => {
		if (!advice.trim()) {
			toast.warn('Advice cannot be empty.');
			return;
		}

		try {
			const response = await axios.put(
				`http://localhost:4000/api/coaches/preview/${subscriptionId}/${selectedWorkout._id}/advice`,
				{ timestamp, advice },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			toast.success('Advice updated successfully!');
			setAdviceList((prev) =>
				prev.map((a) => (a.timestamp === timestamp ? response.data.advice : a))
			);
			setShowPopup(false);
		} catch (error) {
			console.error('Error saving advice:', error);
			toast.error('Failed to save advice. Please try again.');
		}
	};

	// Function to handle adding advice (POST request)
	const handleAddAdvice = async () => {
		if (!advice.trim()) {
			toast.warn('Advice cannot be empty.');
			return;
		}

		try {
			const response = await axios.post(
				`http://localhost:4000/api/coaches/preview/${subscriptionId}/${selectedWorkout._id}/advice`,
				{ timestamp, advice },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);
			toast.success('Advice added successfully!');
			setAdviceList([...adviceList, response.data.advice]);
			setShowPopup(false);
		} catch (error) {
			console.error('Error adding advice:', error);
			toast.error('Failed to add advice. Please try again.');
		}
	};

	// Function to handle deleting advice (DELETE request)
	const handleDeleteAdvice = async () => {
		try {
			await axios.delete(
				`http://localhost:4000/api/coaches/preview/${subscriptionId}/${selectedWorkout._id}/advice`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					data: { timestamp },
				}
			);
			toast.success('Advice deleted successfully!');
			setAdviceList(adviceList.filter((adv) => adv.timestamp !== timestamp));
			setShowPopup(false);
		} catch (error) {
			console.error('Error deleting advice:', error);
			toast.error('Failed to delete advice. Please try again.');
		}
	};

	// Function to handle the timestamp update when the video plays
	const handleTimeUpdate = (e) => {
		const currentTime = Math.floor(e.target.currentTime);
		handleAdviceByTimestamp(currentTime);
	};

	return (
		<div className="w-full min-h-screen px-4 py-10 bg-gray-50">
			<Button
				icon={<LeftOutlined />}
				onClick={() => navigate(-1)}
				className="mb-2"
				style={{ marginRight: "10px" }} // Thêm một chút khoảng cách
			>
				Quay lại
			</Button>
			<div className="max-w-5xl mx-auto">
				<h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
					Video tập luyện
				</h2>

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{workouts.length > 0 ? (
						workouts.map((workout) => (
							<div
								key={workout._id}
								className='relative p-4 transition transform bg-white border rounded-lg shadow-lg cursor-pointer hover:shadow-lg hover:scale-105'
								onClick={() => handleWorkoutClick(workout)}
							>
								{workout.status === 'success' && (
									<div className='absolute px-3 py-1 text-sm font-semibold text-white bg-gree	n-500 rounded-full top-2 right-2'>
										Thành công
									</div>
								)}

								<h3 className="mb-2 text-lg font-medium text-gray-700">
									{workout.name}
								</h3>
								<p className="text-sm text-gray-500">
									{workout.preview?.advice
										? "Advice available"
										: "No advice yet"}
								</p>
								<p className="text-sm font-semibold text-blue-600">
									Tiến độ: {calculateProgressPercentage(workout.progressId)}%
								</p>
							</div>
						))
					) : (
						<p className="text-center text-gray-600 col-span-full">
							Đang tải bài tập...
						</p>
					)}
				</div>
			</div>

			{showPopup && selectedWorkout && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg max-h-screen overflow-y-auto'>
						<h3 className='mb-4 text-xl font-semibold text-gray-800'>{selectedWorkout.name}</h3>

						{/* Video Section */}
						<div className='mb-4'>
							{selectedWorkout.preview?.video && (
								<>
									<video
										controls
										src={selectedWorkout.preview?.video}
										className='w-full h-64 rounded-md'
										onTimeUpdate={handleTimeUpdate} // Track time on update
									>
										Trình duyệt của bạn không hỗ trợ thẻ video.
									</video>

									{/* Display Advice List */}
									<div className='mt-4'>
										<h3 className='mb-2 text-lg font-semibold text-gray-700'>Danh sách lời khuyên:</h3>
										<ul className='space-y-2'>
											{adviceList.length > 0 ? (
												adviceList.map((adv) => (
													<li
														key={adv.timestamp}
														className='flex justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100'
														onClick={() => {
															setTimestamp(adv.timestamp);
															const videoElement = document.querySelector('video');
															if (videoElement) {
																videoElement.currentTime = adv.timestamp; // Set video time
															}
															setCurrentAdvice(adv.advice); // Show advice in the textarea
														}}
													>
														<span>{new Date(adv.timestamp * 1000).toISOString().substr(14, 5)}</span> {/* Format MM:SS */}
														<span className='text-sm text-gray-600'>{adv.advice}</span>
													</li>
												))
											) : (
												<p className='text-sm text-gray-500'>Chưa có lời khuyên nào được thêm vào.</p>
											)}
										</ul>
									</div>
								</>
							)}
						</div>

						{/* Advice Section */}
						<div className='flex flex-col gap-2'>
							<textarea
								value={advice}
								onChange={(e) => setAdvice(e.target.value)}
								placeholder='Nhập lời khuyên cho dấu thời gian này...'
								className='w-full p-3 mb-4 text-gray-600 border border-gray-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>
						<div className='flex justify-end space-x-4'>
							<button
								//onClick={handleAddAdvice}
								className='px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700'
							>
								Thêm lời khuyên
							</button>
							<button
								//onClick={handleSaveAdvice}
								className='px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700'
							>
								Lưu lời khuyên
							</button>
							<button
								//onClick={handleDeleteAdvice}
								className='px-4 py-2 text-white transition bg-red-600 rounded-md hover:bg-red-700'
							>
								Xóa lời khuyên
							</button>
							<button
								onClick={() => setShowPopup(false)}
								className='px-4 py-2 text-gray-800 transition bg-gray-300 rounded-md hover:bg-gray-400'
							>
								Hủy
							</button>
						</div>
					</div>
				</div>
			)}


			<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
		</div>
	);
}

export default PreviewUserWorkout;
