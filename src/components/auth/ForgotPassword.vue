<template>
  <div id="background">
    <div class="main-card">
      <form @submit.prevent="forgotPassword" class="form">
        <h2 class="title">FORGOT PASSWORD?</h2>
        <input
          type="text"
          placeholder="Enter Email Address"
          class="textbox"
          v-model="email"
        />
        <input type="submit" value="Resend Email" class="button green-button" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
    };
  },
  setup() {
    return {};
  },
  methods: {
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    forgotPassword() {
      const validated = this.validateEmail(this.email)
      if (validated === true) {
        this.$store.dispatch("authStore/forgotPassword", { email: this.email}).then(response => {

        })
      }
    },
  },
};
</script>

<style scoped>
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
  color: #ad5482;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
}

#background {
  position: relative;
  top: 20px;
  height: 350px;
  width: 800px;
  background-size: cover;
  margin-left: auto;
  margin-right: auto;
}

.main-card {
  position: relative;
  top: 15%;
  height: 80%;
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
  color: #fff;
  font-weight: bold;
  font-size: 12pt;
  transition: background 0.4s;
  cursor: pointer;
}

.button:hover {
  background: #80b438;
}

.green-button {
  background: #90c843;
}

.green-button:hover {
  background: #80b438;
}

.red-button {
  background: #ff8080;
}

.red-button:hover {
  background: #f90e0e;
}

.title {
  margin-bottom: 10px;
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