import User from "./Models/User.js";

const response = (type, message, other = null) => {
  let obj = {
    type: type,
    message: message,
    data: other,
  };
  return obj;
};

const imagesHolder = async (req, res, next) => {
  req.images = [];
  next();
};

// check if a value is in an array
function isInArray(value, array) {
  let flag = 0;
  array.forEach((item, index) => {
    if (item == value) {
      flag++;
    }
  });
  if (flag != 0) {
    return true;
  }
  return false;
}
class httpException extends Error {
  constructor(message) {
    super(message);
  }
}

async function initAdmin(req, res, next) {
  const admin = await User.findOne({ role: 1, email: "abdelghani@gmail.com" });
  if (!admin) {
    try {
      const admin = await new User({
        fullname: "Abdelghani el mouak",
        email: "abdelghani@gmail.com",
        phone: "0653179026",
        password: "secret",
        role: 1,
      });
      await admin.save();
      next();
    } catch (error) {
      console.log(error);
    }
  }
  next();
}

const logger = (req, res, next) => {
  console.log(
    "Coming : [ " +
      req.method +
      " Request ] " +
      res.statusCode +
      " " +
      req.url +
      " [ " +
      new Date().toDateString() +
      " ]"
  );
  next();
};

export { response, imagesHolder, isInArray, httpException, initAdmin, logger };
