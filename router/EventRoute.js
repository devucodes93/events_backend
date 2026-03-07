import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventsById,
} from "../controller/Event.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
    { name: "consolation_form", maxCount: 1 },
  ]),
  createEvent,
);
router.get("/:id", getEventsById);
router.delete("/:id", deleteEvent);
router.put(
  "/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
    { name: "consolation_form", maxCount: 1 },
  ]),
  createEvent,
);

export default router;
