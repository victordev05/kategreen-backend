function success(res, message, data = null) {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}

function error(res, message, code = 400) {
  return res.status(code).json({
    success: false,
    message
  });
}

module.exports = { success, error };