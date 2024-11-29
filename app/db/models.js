import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { hashPassword } from "../services/auth.server";

// ========== models ========== //

// Create a user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    eventsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
    eventsAttending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

mongoose.model("User", userSchema);

const eventSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    creator: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text" });

mongoose.model("Event", eventSchema);

// pre save password hook
userSchema.pre("save", async function (next) {
  const user = this; // this refers to the user document

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next(); // continue
  }

  const salt = await bcrypt.genSalt(10); // generate a salt
  user.password = await bcrypt.hash(user.password, salt); // hash the password

  user.name = user.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  next(); // continue
});

eventSchema.pre("save", async function (next) {
  const event = this; // this refers to the user document

  event.title = event.title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const creator = await User.findById(event.creator);
  //make sure the user which created the event has the event in their eventsCreated array
  if (!creator.eventsCreated.includes(event._id)) {
    creator.eventsCreated.push(event._id);
    await creator.save();
  }
  next(); // continue
});

export const models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Event", schema: eventSchema, collection: "event" },
];

// ========== initData ========== //

export async function initData() {
  // check if data exists
  const userCount = await mongoose.models.User.countDocuments();
  const eventCount = await mongoose.models.Event.countDocuments();

  if (userCount === 0 || eventCount === 0) {
    await insertData();
  }
}

// ========== insertData ========== //

async function insertData() {
  const User = mongoose.models.User;
  const Event = mongoose.models.Event;

  console.log("Dropping collections...");

  console.log("Inserting data...");
  // Insert users

  const test = await User.create({
    mail: "test@test.dk",
    name: "Tester test",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234"),
  });

  console.log(test);

  const test2 = await User.create({
    mail: "test2@test2.dk",
    name: "Tester test",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234"),
  });

  const event4 = await Event.create({
    date: new Date(2021, 4, 1),
    image:
      "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    title: 101,
    creator: test._id,
    location: "aa",
    description: "A beautiful sunset at the beach in Aarhus",
    attendees: [test2._id],
  });

  const event5 = await Event.create({
    date: new Date(2021, 4, 1),
    image:
      "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    title: "Bike ride",
    creator: test._id,
    location: "aa",
    description: "A beautiful bike ride in Silkeborg",
    attendees: [test2._id],
  });
}
