import axios from "axios";
// const API_BASE_URL = 'http://localhost:8080/v1/api' // local
const API_BASE_URL = "https://api.recoverylabqatar.com/v1/api"; // cloud

export const TreatmentServiceApis = {
  route: "treatmentService",

  // CREATE SERVICE PAGE
  createTreatmentServicePage(body) {
    console.log(body);
    return axios.post(
      `${API_BASE_URL}/${this.route}/saveTreatmentService`,
      body
    );
  },

  // GET ALL TREATMENT SERVICE LIST
  getAllServices() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllTreatmentService`);
  },

  // UPDATE LIVE STATUS
  updateTreatmentLiveStatus(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateLiveStatus`, body);
  },
  // DELETE TREATMENT SERVICE
  deleteTreatmentPage(body) {
    return axios.post(
      `${API_BASE_URL}/${this.route}/removeTreatmentPage`,
      body
    );
  },

  // RENAME
  renameTreatmentService(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateByName`, body);
  },
};

export const plansPackagesApiService = {
  route: "package",

  createPlanPackage(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/createplan`, body);
  },

  getAllplans(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/getAllplans`, body);
  },
  changePlanStatus(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateStatus`, body);
  },
  updateOrder(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateOrder`, body);
  },
  updatePlan(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updatePackage`, body);
  },
};

export const packageTypeApiService = {
  route: "packageType",

  createPackageType(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/save`, body);
  },

  getAllPackageTypes() {
    return axios.get(`${API_BASE_URL}/${this.route}/getPackageType`);
  },

  deletePackageType(id) {
    return axios.post(`${API_BASE_URL}/${this.route}/delete/${id}`);
  },

  updatePackageType(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/update`, body);
  },
};

export const userApiService = {
  route: "userService",

  createAdmin(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/createAdmin`, body);
  },

  createUser(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/createUser`, body);
  },

  getAllAdmins() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllAdmins`);
  },

  changeStatus(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/changeActiveStatus`, body);
  },

  deleteAdmin(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/removeUser`, body);
  },

  adminLogin(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/adminlogin`, body);
  },

  getUserInfo(body) {
    return axios.get(`${API_BASE_URL}/${this.route}/getprofile`, {
      headers: {
        "x-access-token": body.token,
      },
    });
  },

  updateUser(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateUser`, body);
  },

  changePassword(body, headers) {
    return axios.post(`${API_BASE_URL}/${this.route}/changePassword`, body, {
      headers,
    });
  },

  getAllUsers() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllUser`);
  },
};

export const classApiService = {
  route: "classService",

  createClass(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/createClass`, body);
  },

  getAllClasses(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/getAllClasses`, body);
  },

  getAllClassesComplete() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllClasses`);
  },

  changeClassStatus(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateStatus`, body);
  },

  updateClass(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateClass`, body);
  },

  deleteClassPlan(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/deleteClass`, body);
  },

  deleteClassType(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/deleteAllClassess`, body);
  },

  getAllClassNames() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllClassNames`);
  },
  createClassType(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/saveAllClasses`, body);
  },
  updateClassType(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateAllClassess`, body);
  },
};

export const pageDetailApiService = {
  route: "pageDetail",

  savePageDetails(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/savePageDetails`, body);
  },

  getPageDetails(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/getPageDetails`, body);
  },
};

export const imageFileServiceApi = {
  route: "userService",
  // http://localhost:8080/v1/api/userService/uploadImage

  uploadImage(body) {
    console.log(body);
    return axios.post(`${API_BASE_URL}/${this.route}/uploadImage`, body);
  },
};

export const instructorServiceApi = {
  route: "instructor",

  createInstructor(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/createInstructor`, body);
  },

  getAllInstructors() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllInstructors`);
  },

  updateInstructor(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateInstructor`, body);
  },

  deleteInstructor(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/deleteInstructor`, body);
  },
};

export const dashboardServiceApi = {
  route: "dashboard",

  getUserCounts() {
    return axios.get(`${API_BASE_URL}/${this.route}/users`);
  },

  getTransactionDashboard() {
    return axios.get(`${API_BASE_URL}/${this.route}/transactionDashboard`);
  },

  getDashboardMain() {
    return axios.get(`${API_BASE_URL}/${this.route}/dashboardmain`);
  },

  getTodayBooking() {
    return axios.get(`${API_BASE_URL}/${this.route}/todaybooking`);
  },
};

export const bookingServiceApi = {
  route: "booking",

  getAllBookings() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllBooking`);
  },

  changeBookingStatus(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/update`, body);
  },

  rescheduleBooking(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/reschedule`, body);
  },

  getAllUserBooking(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/getAllUserBooking`, body);
  },
  updateBooking(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/updateBooking`, body);
  },
};

export const transactionsServiceApi = {
  route: "transaction",

  getAllTransactions() {
    return axios.post(`${API_BASE_URL}/${this.route}/getAll`);
  },

  getAllUserTransactions(body) {
    return axios.post(
      `${API_BASE_URL}/${this.route}/getAllUserTransactions`,
      body
    );
  },
};

export const subcribersServiceApi = {
  route: "newsLatter",

  getAllSubscribers() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAllSubscribers`);
  },
};

export const instagramFeedsServiceApi = {
  route: "instaFeed",

  saveNewFeed(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/save`, body);
  },

  getAllFeeds() {
    return axios.get(`${API_BASE_URL}/${this.route}/getAll`);
  },

  deleteFeed(body) {
    return axios.post(`${API_BASE_URL}/${this.route}/delete`, body);
  },
};
