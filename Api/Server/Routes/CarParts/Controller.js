import { httpException, isInArray, response } from "../../utils.js";
import multer, { diskStorage } from "multer";
import path from "path";
import Image from "../../Models/Image.js";
import CarPart from "../../Models/CarPart.js";
import Notification from "../../Models/Notification.js";
import { io } from "../../index.js";

const itemById = async (req, res, next, id) => {
  try {
    const item = await CarPart.findOne({ _id: id })
      .populate("gallery")
    if (!item)
      return res
        .status(404)
        .json(response("error", "CarPart not found."));
    req.item = item;
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
            { description: { $regex: search, $options: "i" } },
            { manufacturer: { $regex: search, $options: "i" } },
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
        req.item
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
    const item = await CarPart.create({
      name,
      description,
      manufacturer,
      price,
      stock_quantity,
      gallery: IMAGES,
    });
    if (item.stock_quantity == 0){
      const notification = await Notification.create({
        title: "Warning",
        message: `The ${item.name} is out of stock`,
      })
      io.emit('notification', notification)
    } else if (item.stock_quantity < 10){
      const notification = await Notification.create({
        title: "Informe",
        message: `The stock quantity of ${item.name} is ${item.stock_quantity}`,
      })
      io.emit('notification', notification)
    }
    res
      .status(200)
      .json(
        response(
          "success",
          "CarPart created successfully",
          item
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while creating the item. " + error.message
        )
      );
  }
};


const verifyUpdateInputs = (req, res, next) => {
  const { name, description, manufacturer, price, stock_quantity } = req.body;
  if (!name) 
    return res.status(400).json(response("name", "Name is required", item));
  if (!description)
    return res.status(400).json(response("description", "Description is required", item));
  if(!manufacturer)
    return res.status(400).json(response("manufacturer", "Manufacturer is required", item));
  if(!price)
    return res.status(400).json(response("price", "Price is required"));
  if(!stock_quantity)
    return res.status(400).json(response("stock_quantity", "Stock quantity is required", item));

  if (name.length < 3)
    return res.status(400).json(response("name", "Name should be at least 3 characters long", item));
  if (description.length < 3)
    return res.status(400).json(response("description", "Description should be at least 3 characters long", item));
  if (manufacturer.length < 3)
    return res.status(400).json(response("manufacturer", "Manufacturer should be at least 3 characters long", item));
  next();
};

const update = async (req, res) => {
  try {
    const { name, description, manufacturer, price, stock_quantity, remove } = req.body;
    const { item, images } = req;

    // Check if the item name is already taken
    const catName = await CarPart.findOne({ name });
    if (catName && catName.name != item.name)
      return res.status(400).json(response("name", "This name is already taken.", item));

    // Settling the uploaded images array
    let IMAGES = [];
    if (images.length != 0) {
      const imagesArr = images.map((image) => {
        return {
          name: image,
          src: `/assets/Images/${image}`,
        };
      });
      IMAGES = await Image.insertMany(imagesArr);
      IMAGES = IMAGES.map((image) => image._id);
    }

    const updated_item = await CarPart.findOne({ _id: item._id });
    if (typeof remove != undefined) {
      if (typeof remove == "string") {
        const arr = remove.split(",");
        if(item.gallery.length <= arr.length){
          let flag = 0;
          item.gallery.map(img => {
            arr.map(id => {
              if(img._id == id){
                flag = flag + 1;
              }
            })
          })
          if(flag == item.gallery.length)
            return res.status(400).json(response('file','You can\'t delete all the images of this item, one required', item))
        }
        arr.forEach((imageId) => {
          updated_item.gallery = updated_item.gallery.filter((image) => image != imageId);
        });
      }
    }

    // Updating the item with the new data
    updated_item.name = name;
    updated_item.manufacturer = manufacturer;
    updated_item.description = description;
    updated_item.price = price;
    updated_item.stock_quantity = stock_quantity;
    updated_item.gallery = [...updated_item.gallery, ...IMAGES];

    await updated_item.populate("gallery");
    await updated_item;
    await updated_item.save();

    if (updated_item.stock_quantity == 0){
      const notification = await Notification.create({
        title: "Warning",
        message: `The ${updated_item.name} is out of stock`,
      })
      io.emit('notification', notification)
    } else if (updated_item.stock_quantity < 10){
      const notification = await Notification.create({
        title: "Informe",
        message: `The stock quantity of ${updated_item.name} is ${updated_item.stock_quantity}`,
      })
      io.emit('notification', notification)
    }

    res.status(200).json(response("success", "CarPart updated successfully.", updated_item));
  } catch (error) {
    // This is returned when something goes wrong
    res.status(500).json(response("error", `Something went wrong while updating the car part. ${error.message}`));
  }
};

// delete item
const remove = async (req, res) => {
  try {
    const { item } = req;
    await CarPart.deleteOne({ _id: item._id });
    res.status(200).json(response("success", "CarPart is deleted!"));
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while deleting the car Part. " + error.message
        )
      );
  }
};

// delete multiple categories
const deleteMultiple = async (req, res) => {
  try {
    const { ids } = req.body;
    await CarPart.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json(
        response(
          "success",
          "Car Parts deleted successfully!"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        response(
          "error",
          "Something went wrong while deleting Car Parts. " + error.message
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
};
