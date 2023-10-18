import { httpException, isInArray, response } from "../../utils.js";
import User from "../../Models/User.js";


const userById = async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(400)
        .json(response("error", 'User not found!'));
    user.password = null;
    user.salt = null;
    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          'Something went wrong while fetching the user. Please try again later.'
        )
      );
  }
};

const updateTheme = async (req, res) => {
  const { user } = req;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { theme: req.body.theme },
      { new: true }
    );
    res
      .status(200)
      .json(
        response("success", 'theme updated successfully!', updatedUser.theme)
      );
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json(
        response(
          "error",
          'Something went wrong while updating the theme. Please try again later.'
        )
      );
      
  }
};

export {
  userById,
  updateTheme,
};
