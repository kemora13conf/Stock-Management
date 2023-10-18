import { httpException, isInArray, response } from "../../utils.js";
import multer, { diskStorage } from "multer";
import path from "path";
import Image from "../../Models/Image.js";
import CarPart from "../../Models/CarPart.js";

const itemById = async (req, res, next, id) => {
  try {
    const category = await CarPart.findOne({ _id: id })
      .populate("gallery")
      .populate("user");
    if (!category)
      return res
        .status(404)
        .json(response("error", "CarPart not found."));
    req.category = category;
    next();
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while fetching data. " + error.message
        )
      );
  }
};

const list = async (req, res) => {
  let { search, searchby, orderby, page, limit } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  searchby = searchby ? searchby.toLocaleLowerCase() : "all";
  orderby = orderby ? orderby.toLocaleLowerCase() : "name";

  try {
    let carParts = [];
    if (search) {
      if (searchby == "all") {
        carParts = await CarPart.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        })
          .populate('gallery')
          .collation({ locale: "en", strength: 2 })
          .sort({ [orderby]: "asc" });
      } else {
        carParts = await CarPart.find({
          [searchby]: { $regex: search, $options: "i" },
        })
          .populate('gallery')
          .collation({ locale: "en", strength: 2 })
          .sort({ [orderby]: "asc" });
      }
    } else {
      carParts = await CarPart.find({})
        .populate('gallery')
        .collation({ locale: "en", strength: 2 })
        .sort({ [orderby]: "asc" });
    }
    const total = carParts.length;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    limit ? (carParts = carParts.slice(offset, offset + limit)) : "";
    res.status(200).json(
      response("success", "Data fetched successfully", {
        carParts,
        total,
        pages,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while fetching data. " + error.message
        )
      );
  }
};

const item = (req, res) => {
  return res
    .status(200)
    .json(
      response(
        "success",
        "CarPart fetched successfully",
        req.category
      )
    );
};

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), "Public/Images"));
  },
  filename: function (req, file, cb) {
    const { images } = req;
    const ALLOWEDEXT = ["png", "jpg", "jpeg", "webp"];

    const nameArr = file.originalname.split(".");
    const ext = nameArr[nameArr.length - 1];

    if (!isInArray(ext.toLocaleLowerCase(), ALLOWEDEXT)) {
      const error = response(
        "file",
        `File format error. Allowed file types: ${ALLOWEDEXT.join(", ")}`
      );
      return cb(new httpException(JSON.stringify(error)), false);
    }

    const fileName = "CarPArts-" + Date.now() + "." + ext;
    if (fileName) req.images = [...images, fileName];
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

const verifyInputs = (req, res, next) => {
  const { name, description, manufacturer, price, stock_quantity } = req.body;
  const { images } = req;
  if (!name) 
    return res.status(400).json(response("name", "Name is required"));
  if (!description)
    return res.status(400).json(response("description", "Description is required"));
  if(!manufacturer)
    return res.status(400).json(response("manufacturer", "Manufacturer is required"));
  if(!price)
    return res.status(400).json(response("price", "Price is required"));
  if(!stock_quantity)
    return res.status(400).json(response("stock_quantity", "Stock quantity is required"));

  if (images.length == 0)
    return res.status(400).json(response("file", "Image is required"));
  if (name.length < 3)
    return res.status(400).json(response("name", "Name should be at least 3 characters long"));
  if (description.length < 3)
    return res.status(400).json(response("description", "Description should be at least 3 characters long"));
  if (manufacturer.length < 3)
    return res.status(400).json(response("manufacturer", "Manufacturer should be at least 3 characters long"));
  next();
};

const create = async (req, res) => {
  try {
    const { name, description, manufacturer, price, stock_quantity } = req.body;
    const { images } = req;

    const catName = await CarPart.findOne({ name });
    if (catName) return res.status(400).json(response("name", "CarPart name is already taken"));

    const imagesArr = images.map((image) => {
      return {
        name: image,
        src: `/assets/Images/${image}`,
        client: req.currentUser._id,
      };
    });
    let IMAGES = await Image.insertMany(imagesArr);
    IMAGES = IMAGES.map((image) => image._id);
    const category = await CarPart.create({
      name,
      description,
      manufacturer,
      price,
      stock_quantity,
      gallery: IMAGES,
    });
    res
      .status(200)
      .json(
        response(
          "success",
          "CarPart created successfully",
          category
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while creating the category. " + error.message
        )
      );
  }
};


const verifyUpdateInputs = (req, res, next) => {
  const { name, title, description } = req.body;
  if (!name) return res.status(400).json(response("name", "Name field is required."));
  if (!title) return res.status(400).json(response("title", "Title field is required."));
  if (!description) return res.status(400).json(response("description", "Description field is required."));
  if (name.length < 3) return res.status(400).json(response("name", "Name field length is too short."));
  if (title.length < 3) return res.status(400).json(response("title", "Title field length is too short."));
  if (description.length < 3) return res.status(400).json(response("description", "Description field length is too short."));
  next();
};

const update = async (req, res) => {
  const { currentUser } = req;
  if (!currentUser.can_edit_category()) return res.status(401).json(response("error", "You do not have permission to edit this category."));

  try {
    let { name, title, description, remove } = req.body;
    const { category, images } = req;

    // Check if the category name is already taken
    const catName = await CarPart.findOne({ name });
    if (catName && catName.name != category.name)
      return res.status(400).json(response("name", "This name is already taken."));

    // Settling the uploaded images array
    let IMAGES = [];
    if (images.length != 0) {
      const imagesArr = images.map((image) => {
        return {
          name: image,
          src: `/assets/Images/${image}`,
          client: req.currentUser._id,
        };
      });
      IMAGES = await Image.insertMany(imagesArr);
      IMAGES = IMAGES.map((image) => image._id);
    }

    const updated_category = await CarPart.findOne({ _id: category._id });
    if (typeof remove != undefined) {
      if (typeof remove == "string") {
        const arr = remove.split(",");
        arr.forEach((imageId) => {
          updated_category.gallery = updated_category.gallery.filter((image) => image != imageId);
        });
      }
    }

    // Updating the category with the new data
    updated_category.name = name;
    updated_category.title = title;
    updated_category.description = description;
    updated_category.gallery = [...updated_category.gallery, ...IMAGES];

    await updated_category.populate("gallery");
    await updated_category;
    await updated_category.save();
    res.status(200).json(response("success", "CarPart updated successfully.", updated_category));
  } catch (error) {
    // This is returned when something goes wrong
    res.status(500).json(response("error", `Something went wrong while updating the category. ${error.message}`));
  }
};

// delete category
const remove = async (req, res) => {
  const { currentUser } = req;
  if (!currentUser.can_delete_category())
    return res.status(401).json(response("error", "You don't have permission to delete this category."));

  try {
    const { category } = req;
    await CarPart.deleteOne({ _id: category._id });
    res.status(200).json(response("success", "CarPart is deleted!"));
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while deleting the category. " + error.message
        )
      );
  }
};

// delete multiple categories
const deleteMultiple = async (req, res) => {
  const { currentUser } = req;
  if (!currentUser.can_delete_category())
    return res.status(401).json(response("error", "You don't have permission to delete categories."));

  try {
    const { ids } = req.body;
    await CarPart.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json(
        response(
          "success",
          "Categories deleted successfully!"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while deleting categories. " + error.message
        )
      );
  }
};

// change state
const changeState = async (req, res) => {
  const { currentUser } = req;
  if (!currentUser.can_edit_category())
    return res.status(401).json(response("error", "You don't have permission to change the state of this category."));

  try {
    const { state } = req.body;
    const { category } = req;
    category.enabled = state;
    await category.save();
    res
      .status(200)
      .json(
        response(
          "success",
          `${state ? "CarPart enabled" : "CarPart disabled"} successfully!`,
          category
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while changing the state of the category. " + error.message
        )
      );
  }
};

export {
  itemById,
  list,
  item,
  upload,
  verifyInputs,
  create,
  verifyUpdateInputs,
  update,
  remove,
  deleteMultiple,
  changeState,
};
