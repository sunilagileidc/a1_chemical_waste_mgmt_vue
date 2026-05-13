import axiosPlugin from './axios.js';

export default {
  install(app) {
    app.use(axiosPlugin);
  }
};
