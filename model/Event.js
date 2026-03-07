import mongoose from "mongoose";

const EventModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    phone_number: { type: String, required: true },
    no_participants: {
      type: Number,
      min: 1,
    },
    fee: {
      type: Number,
      min: 0,
    },
    location: { type: String, required: true },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
    event_date: { type: Date, required: true },
    event_place: { type: String, required: true },
    event_duration_minutes: { type: Number },
    banner: { type: String },
    avatar: { type: String },
    consolation_form: { type: String },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", EventModel);
export default Event;
