import Vue from "vue";
const moment = require("moment");

Vue.prototype.$moment = moment;
export default async ({ app }, inject) => {
  inject("moment", moment);
};
