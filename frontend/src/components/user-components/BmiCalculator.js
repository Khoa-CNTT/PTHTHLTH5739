import React, { useState } from "react";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/flaticon.css";
import "../css/owl.carousel.min.css";
import "../css/barfiller.css";
import "../css/magnific-popup.css";
import "../css/slicknav.min.css";
import "../css/style.css";
import "./BmiCalculator.css";
import "font-awesome/css/font-awesome.min.css";

function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [bmiResult, setBmiResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weightAdvice, setWeightAdvice] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      setLoading(true); // Hiển thị loader khi bắt đầu tính toán
      setTimeout(() => {
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        let bmiCategory = "";

        if (bmiValue < 18.5) {
          bmiCategory = "Thiếu cân";
        } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
          bmiCategory = "Khỏe mạnh";
        } else if (bmiValue >= 25 && bmiValue <= 29.9) {
          bmiCategory = "Thừa cân";
        } else {
          bmiCategory = "Béo phì";
        }
        setBmiResult(
          `Tỷ lệ mỡ cơ thể của bạn là <strong style="color: #ff5722;">${bmiValue}</strong>.<br>Bạn là: <strong style="color: #ff5722; text-transform: uppercase;">${bmiCategory}</strong>`
        );
         // Tính toán cân nặng lý tưởng và lời khuyên
         const idealWeight = calculateIdealWeight(heightInMeters, sex);
         const weightDifference = (idealWeight - weight);
 
         if (weightDifference > 0) {
          setWeightAdvice(`Bạn cần tăng ${Math.round(weightDifference)} kg để đạt cân nặng lý tưởng.`); // Làm tròn kết quả
        } else if (weightDifference < 0) {
          setWeightAdvice(`Bạn cần giảm ${Math.round(Math.abs(weightDifference))} kg để đạt cân nặng lý tưởng.`); // Làm tròn kết quả
        } else {
          setWeightAdvice("Bạn đang có cân nặng lý tưởng.");
        }

        setLoading(false); // Ẩn loader khi tính toán xong
        setShowPopup(true); // Hiển thị popup sau khi tính toán
      }, 2000); // Giả lập thời gian tính toán 2 giây
    } else {
      alert("Vui lòng nhập chiều cao và cân nặng hợp lệ");
    }
  };
  const calculateIdealWeight = (heightInMeters, sex) => {
    let idealWeight;
    if (sex === "Male") {
      idealWeight = Math.round(22 * heightInMeters * heightInMeters); // Làm tròn đến số nguyên gần nhất
    } else if (sex === "Female") {
      idealWeight = Math.round(21 * heightInMeters * heightInMeters); // Làm tròn đến số nguyên gần nhất
    }
    return idealWeight;
  };

  const closePopup = () => {
    setShowPopup(false); // Đóng popup
  };

  return (
    <div>
      {/* BMI Calculator Section Begin */}
      <section className="bmi-calculator-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title chart-title">
                <span>kiểm tra cơ thể của bạn</span>
                <h2>Biểu đồ BMI </h2>
              </div>
              <div className="chart-table">
                <table>
                  <thead>
                    <tr>
                      <th>BMI</th>
                      <th>TRẠNG THÁI CÂN NẶNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="point">Dưới 18.5</td>
                      <td>Thiếu cân</td>
                    </tr>
                    <tr>
                      <td className="point">18.5 - 24.9</td>
                      <td>Khỏe mạnh</td>
                    </tr>
                    <tr>
                      <td className="point">25.0 - 29.9</td>
                      <td>Thừa cân</td>
                    </tr>
                    <tr>
                      <td className="point">Trên 30.0</td>
                      <td>Béo phì</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-title chart-calculate-title">
                <span>kiểm tra cơ thể của bạn</span>
                <h2>tính toán BMI của bạn</h2>
              </div>
              <div className="chart-calculate-form">
                <form onSubmit={calculateBMI}>
                  <div className="row">
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Chiều cao / cm"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Cân nặng / kg"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Tuổi"
                        className="form-control"
                      />
                    </div>
                    <div className="col-sm-6">
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="form-control"
                        required
                      >
                        <option value="" disabled>
                          Giới tính
                        </option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <button type="submit" className="btn btn-warning">
                        Tính toán
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BMI Calculator Section End */}

      {/* Loader */}
      {loading && (
        <div id="preloder">
          <div className="loader"></div>
        </div>
      )}

      {/* Popup hiện bảng và kết quả BMI */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Kết quả BMI</h3>
            <table>
              <thead>
                <tr>
                  <th>BMI</th>
                  <th>TRẠNG THÁI CÂN NẶNG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dưới 18.5</td>
                  <td>Thiếu cân</td>
                </tr>
                <tr>
                  <td>18.5 - 24.9</td>
                  <td>Khỏe mạnh</td>
                </tr>
                <tr>
                  <td>25.0 - 29.9</td>
                  <td>Thừa cân</td>
                </tr>
                <tr>
                  <td>Bằng và trên 30.0</td>
                  <td>Béo phì</td>
                </tr>
              </tbody>
            </table>
            <p
              style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}
              dangerouslySetInnerHTML={{ __html: bmiResult }}
            />
            <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
              {weightAdvice}
            </p>
            <button className="btn btn-primary" onClick={closePopup}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BmiCalculator;
