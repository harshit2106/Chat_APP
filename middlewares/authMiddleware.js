const User = require("../modals/user");
const AppError = require("./appError");
const catchAsync = require("./catchAsync");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});
