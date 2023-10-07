<template>
  <div id="background">
    <div class="main-card">
      <form @submit.prevent="register" class="form" autocomplete="on">
        <h2 class="title">REGISTER YOUR ACCOUNT</h2>
          <p class="mb-3" v-if="error">
            <b>Please correct the following error(s):</b>
            <ul> <li class="error-message">{{ error }}</li> </ul>
          </p>
          <input type="text" placeholder="First Name" class="textbox" v-model="firstName" autocomplete="on" />
         <input type="text" placeholder="Last Name" class="textbox" v-model="lastName" autocomplete="on" />
        <input type="email" placeholder="Email Address" class="textbox" v-model="email" autocomplete="on" />
        <input type="password" placeholder="Password" class="textbox" v-model="password" autocomplete="on" />
        <input type="password" placeholder="Confirm Password" class="textbox" v-model="confirmPassword" autocomplete="off" />
        <input type="submit" value="Register" class="button" />
        <router-link to="/login">Already signed up? Log in</router-link>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      error: "",
    };
  },
  methods: {
    register() {
      this.error = ""

      if (this.password != this.confirmPassword) {
        this.error = "Please enter confirm password the same as your password."
        return
      }

      this.$store
        .dispatch("authStore/register", {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
        })
        .then((response) => {
          if (response === "OK") {
            this.$router.push({ name: "home" });
            window.location.reload();
          } else {
            this.error = response;
          }
        });
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
}

* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #f0f0f0;
  font-family: helvetica;
}

a {
  display: block;
  color: #f90d87;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
}

#background {
  position: relative;
  top: 20px;
  height: 900px;
  width: 650px;
  background-size: cover;
  margin-left: auto;
  margin-right: auto;
}

.main-card {
  position: relative;
  top: 15%;
  height: 75%;
  width: 450px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background-color: #6250e9 !important;

  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.45);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.45);
}

.main-card ul {
  list-style-type: none;
  margin: 0;
}

.icon {
  height: 24px;
  width: 24px;
  opacity: 0.2;
}

.form {
  float: left;
  height: 86%;
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
}

.textbox {
  height: 50px;
  width: 100%;
  border-radius: 3px;
  border: rgba(0, 0, 0, 0.3) 2px solid;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 30px;
}

.textbox:focus {
  outline: none;
  border: rgba(24, 149, 215, 1) 2px solid;
  color: rgba(24, 149, 215, 1);
}

.button {
  height: 50px;
  width: 100%;
  border-radius: 3px;
  border: rgba(0, 0, 0, 0.3) 0px solid;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 30px;
  background: #90c843;
  color: #fff;
  font-weight: bold;
  font-size: 12pt;
  transition: background 0.4s;
  cursor: pointer;
}

.button:hover {
  background: #80b438 !important;
}

.green-button {
  background: #90c843 !important;
}

.green-button:hover {
  background: #80b438 !important;
}

.red-button {
  background: #ff8080 !important;
}

.red-button:hover {
  background: #f90e0e !important;
}

.title {
  margin-bottom: 10px;
  font-size: 28px;
}


/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
   .main-card {
     width: unset;
     margin-left: unset;
     margin-right: unset;
     top: 8%;
   }

   #background {
     width: unset;
   }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 700px) {
    .course {
    width: unset;
  }
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