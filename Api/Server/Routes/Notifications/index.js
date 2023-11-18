import { Router } from "express";
import { signinRequired } from "../Auth/Controller.js";
import Notification from "../../Models/Notification.js";
import { response } from "../../utils.js";

const router = new Router();

router.get("/", signinRequired, async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    let notifications = await Notification.find({}).sort({ createdAt: -1 });
    const total = notifications.length;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    limit ? (notifications = notifications.slice(offset, offset + limit)) : "";
    res.status(200).json(
      response("success", "Data fetched successfully", {
        notifications,
        total,
        pages,
      })
    );
  } catch (error) {
    res.status(500).json(response("error", error.message));
  }
});

router.get("/unread", signinRequired, async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false });
    res.status(200).json(
      response("success", "Data fetched successfully", notifications)
    );
  } catch (error) {
    res.status(500).json(response("error", error.message));
  }
});

router.put("/read", signinRequired, async (req, res) => {
  const { ids } = req.body;
  try {
    const notifications = await Notification.updateMany(
      { _id: { $in: ids } },
      { isRead: true },
      { new: true }
    );
    res.status(200).json(
      response("success", "Data fetched successfully", {
        notifications,
      })
    );
  } catch (error) {
    res.status(500).json(response("error", error.message));
  }
});

export default router;