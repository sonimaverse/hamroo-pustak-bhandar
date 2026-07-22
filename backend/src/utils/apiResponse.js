const ApiResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode < 400,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export default ApiResponse;
