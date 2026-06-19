const authService = require("../services/auth.service");

// REGISTER
async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);

    // remove sensitive data before sending response
    const { password, ...safeUser } = user;

    res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    const result = await authService.loginUser(identifier, password);

    const { password: pwd, ...safeUser } = result.user;

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token: result.token,
    });
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
}

module.exports = {
  register,
  login,
};