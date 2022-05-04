module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statuscode = err.statuscode || 500;
  err.status = err.status || "error";

  return res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
  });
};
