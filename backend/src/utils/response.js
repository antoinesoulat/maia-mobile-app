const successResponse = (data = {}) => ({
  success: true,
  data
});

const errorResponse = (code, message) => ({
  success: false,
  error: {
    code,
    message
  }
});

module.exports = { errorResponse, successResponse };
