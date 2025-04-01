import React, { useEffect } from "react";

function Footer() {
  return (
    <div>
      {/* Get In Touch Section Begin */}
      <div class="gettouch-section">
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <div class="gt-text update-gt-text">
                <i class="fa fa-map-marker"></i>
                <p>
                  Duy Tân University
                  <br /> Đà Nẵng
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="gt-text update-gt-text">
                <i class="fa fa-mobile"></i>
                <p>(+84) 123 456 789</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="gt-text email update-gt-text">
                <i class="fa fa-envelope"></i>
                <p>fitzoneteams@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Get In Touch Section End */}

    </div>
  );
}
export default Footer;
