<template>
  <div class="p-4 container light-style flex-grow-1 container-p-y">
    <div class="quiz-result-header">
      <div class="left-column">
        <h2 class="font-weight-bold py-3 mb-4">
          <font-awesome-icon :icon="faCog"></font-awesome-icon> Account Settings
        </h2>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="row no-gutters row-bordered row-border-light">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links">
            <a
              class="list-group-item list-group-item-action active"
              data-toggle="list"
              href="#account-general"
              @click="changeTab(1)"
              ><font-awesome-icon :icon="faUser"></font-awesome-icon> Personal
              Information</a
            >
            <a
              class="list-group-item list-group-item-action"
              data-toggle="list"
              href="#account-change-password"
              @click="changeTab(2)"
              ><font-awesome-icon :icon="faLock"></font-awesome-icon> Passwords
              and Security</a
            >
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <div class="tab-pane fade active show" id="account-general">
              <div class="card-body media align-items-center">
                <img
                  :src="`https://learningenglishapp-assets.s3-us-west-1.amazonaws.com/avatars/${avatarUrl}`"
                  alt=""
                  class="d-block ui-w-80"
                />
                <form enctype="multipart/form-data" class="media-body ml-4">
                  <label
                    v-if="avatar.currentStatus !== STATUS_SUCCESS"
                    class="btn btn-primary"
                  >
                    Change Avatar
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      class="account-settings-avatar"
                      @change="fileChange"
                    />
                  </label>
                  <label v-else class="btn btn-primary">
                    Save Avatar
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      class="account-settings-avatar"
                      @change="saveAvatar"
                    />
                  </label>

                  <div class="text-light small mt-1">
                    Allowed JPG, JPEG and PNG. 2MB max
                  </div>
                </form>
              </div>
              <hr class="border-light m-0" />
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control mb-1"
                    id="firstName"
                    placeholder="Enter First Name"
                    name="firstName"
                    required
                    v-model="firstName"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control mb-1"
                    id="lastName"
                    placeholder="Enter Last Name"
                    name="lastName"
                    v-model="lastName"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">E-mail</label>
                  <input
                    type="text"
                    class="form-control mb-1"
                    v-model="email"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select
                    name="filterBy"
                    id="filter-by"
                    class="form-control"
                    v-model="gender"
                  >
                    <option class="dropdown-item" value="M">Male</option>
                    <option class="dropdown-item" value="F">Female</option>
                    <option class="dropdown-item" value="U">Unspecified</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="account-change-password">
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
              <div class="card-body pb-2">
                <div class="form-group">
                  <label class="form-label">Current password</label>
                  <input
                    type="password"
                    autocomplete="on"
                    class="form-control"
                    v-model="currentPassword"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">New password</label>
                  <input
                    type="password"
                    autocomplete="off"
                    class="form-control"
                    v-model="newPassword"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Confirm password</label>
                  <input
                    type="password"
                    autocomplete="off"
                    class="form-control"
                    v-model="confirmPassword"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-right mt-3">
      <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
      <button type="button" class="btn btn-primary ml-3" @click="save()">
        Save changes</button
      >
      
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const STATUS_INITIAL = 0,
  STATUS_UPLOADING = 1,
  STATUS_SAVING = 2,
  STATUS_SUCCESS = 3,
  STATUS_FAILED = 4;

export default {
  components: { FontAwesomeIcon },
  props: ["email_address", "first_name", "last_name"],
  computed: {
    faUser() {
      return faUser;
    },
    faCog() {
      return faCog;
    },
    faLock() {
      return faLock;
    },
    publicPath() {
      return process.env.BASE_URL;
    },
    avatarUrl() {
      return localStorage.getItem("avatarUrl");
    },
  },
  data() {
    return {
      email: this.email_address,
      firstName: this.first_name ? this.first_name : "",
      lastName: this.first_name ? this.last_name : "",
      gender: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      currentTab: 1,
      errorMessage: "",
      successMessage: "",
      avatar: {
        uploadedFiles: {},
        uploadError: null,
        currentStatus: STATUS_INITIAL,
        mimeId: null,
      },
    };
  },
  methods: {
    fileChange(event) {
      event.preventDefault();
      event.stopPropagation();
      const uploadedFiles = event.target.files;
      if (uploadedFiles.length === 1) {
        this.avatar.currentStatus = STATUS_UPLOADING;
        this.avatar.uploadedFiles = uploadedFiles;
        const formData = this.createFormData();
        this.$store
          .dispatch("settingStore/uploadAvatar", formData)
          .then((response) => {
            if (typeof response === "object") {
              this.avatar.currentStatus = STATUS_SUCCESS;
              this.avatar.mimeId = response.mimeId;
            } else {
              this.avatar.currentStatus = STATUS_FAILED;
            }
          });
      }
    },
    createFormData() {
      const formData = new FormData();

      formData.append("avatar", this.avatar.uploadedFiles[0]);

      return formData;
    },
    cancel() {
      this.$router.push({
        name: "home",
      });
    },
    save() {
      if (this.currentTab === 1) {
        this.$store
          .dispatch("settingStore/saveUserInfo", {
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
          })
          .then((response) => {
            if (response !== "OK") {
              this.errorMessage = response;
            } else {
              this.successMessage =
                "Your personal information has been updated successfully.";
            }
          });
      } else if (this.currentTab === 2) {
        this.$store
          .dispatch("settingStore/changePassword", {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          })
          .then((response) => {
            if (response !== "OK") {
              this.errorMessage = response;
            } else {
              this.successMessage =
                "Your password has been updated successfully.";
            }
          });
      }
    },
    changeTab(index) {
      this.currentTab = index;
      this.errorMessage = "";
      this.successMessage = "";
    },
  },
  created() {
    this.$store.dispatch("settingStore/fetchUserInfo", {}).then((response) => {
      this.user = this.$store.getters["settingStore/getUser"];

      this.email = this.user.email;
      this.firstName = this.user.first_name;
      this.lastName = this.user.last_name;
      this.gender = this.user.gender;
    });
  },
};
</script>

<style scoped>
.quiz-result-header {
  width: 100%;
  height: auto;
  background-color: #6d7fcc;
  white-space: initial;
  overflow: auto;
  padding: 20px 20px 0 20px;
  color: #f7f7f7;
}

.form-label {
  color: #1c1c1c;
  font-weight: bold;
}

body {
  background: #1c1c1c;
  margin-top: 20px;
}

.ui-w-80 {
  width: 80px !important;
  height: auto;
}

.btn-default {
  border-color: rgba(24, 28, 33, 0.1);
  background: rgba(0, 0, 0, 0);
  color: #4e5155;
}

label.btn {
  margin-bottom: 0;
}

.btn {
  cursor: pointer;
}

.text-light {
  color: #babbbc !important;
}

.card {
  background-clip: padding-box;
  box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
  overflow: hidden;
}

.account-settings-avatar {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.account-settings-links .list-group-item.active {
  font-weight: bold !important;
}
</style>