import cloudinary from "../config/cloudinary.js";
import Event from "../model/Event.js";
export const createEvent = (req, res) => {
  const {
    title,
    description,
    organizer,
    phone_number,
    no_participants,
    fee,
    location,
    template_id,
    event_date,
    event_place,
    event_duration,
  } = req.body;

  const banner = req.files.banner?.[0];
  const avatar = req.files.avatar?.[0];
  const consolation_form = req.files.consolation_form?.[0];

  if (
    !title ||
    !description ||
    !organizer ||
    !phone_number ||
    !location ||
    !event_date ||
    !event_place
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newEvent = new Event({
    title,
    description,
    organizer,
    phone_number,
    no_participants,
    fee,
    location,
    template_id,
    event_date,
    event_place,
    event_duration_minutes: event_duration,
    banner: banner ? banner.path : undefined,
    avatar: avatar ? avatar.path : undefined,
    consolation_form: consolation_form ? consolation_form.path : undefined,
  });
  newEvent
    .save()
    .then((event) => res.status(201).json(event))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error creating event", error: err.message }),
    );
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
