<template>
  <footer id="dk-footer" class="dk-footer">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div class="row">
            <div class="col-md-6"></div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-6">
              <div class="footer-widget footer-left-widget">
                <div class="section-heading">
                  <h3>Follow us</h3>
                  <span class="animate-border border-black"></span>
                  <p class="footer-info-text">
                    Connect with us by following our pages on social media.
                  </p>
                </div>

                <div class="section-heading">
                  <div class="footer-social-link">
                    <ul>
                      <li>
                        <a href="#">
                          <i class="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-linkedin"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 col-lg-6">
              <div class="footer-widget">
                <div class="section-heading">
                  <h3>Subscribe to newsletter</h3>
                  <span class="animate-border border-black"></span>
                  <p class="footer-info-text">
                    We are dedicated to helping you leveling up your English
                    command and connecting you with English-speaking communities
                    all over the world.
                  </p>
                </div>
                <form action="#">
                  <div class="form-row">
                    <div class="col dk-footer-form">
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Email Address"
                      />
                      <button type="submit">
                        <i class="fa fa-send"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <span>Copyright © 2021, All Right Reserved</span>
          </div>
          <div class="col-md-6 col-sm-12">
            <div class="copyright-menu">
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* footer {
  margin-top: 100px;
} */

body {
  color: #ccc;
}
.footer-widget p {
  margin-bottom: 27px;
}
p {
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  color: white;
  line-height: 28px;
}

.animate-border {
  position: relative;
  display: block;
  width: 275px;
  height: 3px;
  background: #007bff;
}

.animate-border:after {
  position: absolute;
  content: "";
  width: 170px;
  height: 3px;
  left: 0;
  bottom: 0;
  border-left: 10px solid #fff;
  border-right: 10px solid #fff;
  -webkit-animation: animborder 2s linear infinite;
  animation: animborder 2s linear infinite;
}

@-webkit-keyframes animborder {
  0% {
    -webkit-transform: translateX(0px);
    transform: translateX(0px);
  }
  100% {
    -webkit-transform: translateX(113px);
    transform: translateX(113px);
  }
}

@keyframes animborder {
  0% {
    -webkit-transform: translateX(0px);
    transform: translateX(0px);
  }
  100% {
    -webkit-transform: translateX(113px);
    transform: translateX(113px);
  }
}

.animate-border.border-white:after {
  border-color: #fff;
}

.animate-border.border-yellow:after {
  border-color: #f5b02e;
}

.animate-border.border-orange:after {
  border-right-color: #007bff;
  border-left-color: #007bff;
}

.animate-border.border-ash:after {
  border-right-color: #eef0ef;
  border-left-color: #eef0ef;
}

.animate-border.border-offwhite:after {
  border-right-color: #f7f9f8;
  border-left-color: #f7f9f8;
}

/* Animated heading border */
@keyframes primary-short {
  0% {
    width: 15%;
  }
  50% {
    width: 90%;
  }
  100% {
    width: 10%;
  }
}

@keyframes primary-long {
  0% {
    width: 80%;
  }
  50% {
    width: 0%;
  }
  100% {
    width: 80%;
  }
}

.dk-footer {
  padding: 75px 0 0;
  background-color: #151414;
  position: relative;
  z-index: 2;
}
.dk-footer .contact-us {
  margin-top: 0;
  margin-bottom: 30px;
  padding-left: 80px;
}
.dk-footer .contact-us .contact-info {
  margin-left: 50px;
}
.dk-footer .contact-us.contact-us-last {
  margin-left: -80px;
}
.dk-footer .contact-icon i {
  font-size: 24px;
  top: -15px;
  position: relative;
  color: #007bff;
}

.dk-footer-box-info {
  position: absolute;
  top: -122px;
  background: #202020;
  padding: 40px;
  z-index: 2;
}
.footer-social-link h3 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 25px;
}
.footer-social-link ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.footer-social-link li {
  display: inline-block;
}
.footer-social-link a i {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  background: #000;
  margin-right: 5px;
  color: #fff;
}
.footer-social-link a i.fa-facebook {
  background-color: #3b5998;
}
.footer-social-link a i.fa-twitter {
  background-color: #55acee;
}
.footer-social-link a i.fa-google-plus {
  background-color: #dd4b39;
}
.footer-social-link a i.fa-linkedin {
  background-color: #0976b4;
}
.footer-social-link a i.fa-instagram {
  background-color: #b7242a;
}

.footer-info-text {
  margin: 26px 0 32px;
}

.footer-widget .section-heading {
  margin-bottom: 35px;
}

.footer-widget h3 {
  font-size: 24px;
  color: #fff;
  position: relative;
  margin-bottom: 15px;
  max-width: -webkit-fit-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
}

.footer-widget ul {
  float: left;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-widget li {
  margin-bottom: 18px;
}

.footer-widget p {
  margin-bottom: 27px;
}

.footer-widget a {
  color: #878787;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.footer-widget a:hover {
  color: #007bff;
}

.footer-widget:after {
  content: "";
  display: block;
  clear: both;
}

.dk-footer-form {
  position: relative;
}
.dk-footer-form input[type="email"] {
  padding: 14px 28px;
  border-radius: 50px;
  background: #2e2e2e;
  border: 1px solid #2e2e2e;
}
.dk-footer-form input::-webkit-input-placeholder,
.dk-footer-form input::-moz-placeholder,
.dk-footer-form input:-ms-input-placeholder,
.dk-footer-form input::-ms-input-placeholder,
.dk-footer-form input::-webkit-input-placeholder {
  color: #878787;
  font-size: 14px;
}
.dk-footer-form input::-webkit-input-placeholder,
.dk-footer-form input::-moz-placeholder,
.dk-footer-form input:-ms-input-placeholder,
.dk-footer-form input::-ms-input-placeholder,
.dk-footer-form input::placeholder {
  color: #878787;
  font-size: 14px;
}
.dk-footer-form button[type="submit"] {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 24px 6px 17px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  border: 1px solid #007bff;
  background: #007bff;
  color: #fff;
}
.dk-footer-form button:hover {
  cursor: pointer;
}

/* ==========================

    Contact

=============================*/
.contact-us {
  position: relative;
  z-index: 2;
  margin-top: 65px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.copyright {
  padding: 28px 0;
  margin-top: 55px;
  background-color: #202020;
}
.copyright span,
.copyright a {
  color: #878787;
  -webkit-transition: all 0.3s linear;
  -o-transition: all 0.3s linear;
  transition: all 0.3s linear;
}
.copyright a:hover {
  color: #007bff;
}

.copyright-menu ul {
  text-align: right;
  margin: 0;
}

.copyright-menu li {
  display: inline-block;
  padding-left: 20px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .copyright {
    text-align: center;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>