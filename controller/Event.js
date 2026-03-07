import cloudinary from "../config/cloudinary.js";
import pool from "../config/db.js";``

export const createEvent = (req, res) => {
  const {
    eventName,
    description,
    organizer,
    phone_number,
    no_participants,
    fee,
    location,
    template_id,
    event_date,
    event_place,
    event_duration_minutes,
  } = req.body;

  const banner = req.files?.banner?.[0];
  const avatar = req.files?.avatar?.[0];
  const consolation_form = req.files?.consolation_form?.[0];

  if (
    !eventName ||
    !description ||
    !organizer ||
    !phone_number ||
    !location ||
    !event_date ||
    !event_place
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
  INSERT INTO events 
  (eventName, 
  description,
  organizer,
  phone_number,
  no_participants,
  fee,
  location,
  template_id,
  event_date,
  event_place,
  event_duration_minutes,
  banner,
  avatar,
  consolation_form) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;

  const newEvent = [
    eventName,
    description,
    organizer,
    phone_number,
    no_participants,
    fee,
    location,
    template_id,
    event_date,
    event_place,
    event_duration_minutes,
    banner ? banner.path : undefined,
    avatar ? avatar.path : undefined,
    consolation_form ? consolation_form.path : undefined,
  ];

  const result = pool.query(query, newEvent)
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error creating event", error: err.message });
    });
};

export const getEventsById = (req, res) => {
  const { id } = req.params;

  Event.findById(id)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error fetching event", error: err.message }),
    );
};

export const deleteEvent = (req, res) => {
  const { id } = req.params;

  Event.findByIdAndDelete(id)
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error deleting event", error: err.message }),
    );
};

export const updateEvent = (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  Event.findByIdAndUpdate(id, updateData, { new: true })
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error updating event", error: err.message }),
    );
};
