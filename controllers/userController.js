const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");
const User = require("../modals/user");
const sendToken = require("../Utils/generateToken");

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("enter all fields", 401));
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new AppError("user already exists", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please fill all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("invalid email", 400));
  }
  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched) {
    return next(new AppError("invalid password", 400));
  }
  sendToken(user, 200, res);
});

exports.signout = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: false,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.allUser = catchAsync(async (req, res, next) => {
  const useer = await User.find({});
  const user = useer.filter((i) => {
    return String(i._id) !== String(req.user._id);
  });
  return res.status(200).json({ user });
});
