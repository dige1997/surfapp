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
    lastname: {
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
    hobbies: {
      type: [String],
    },
    avatarUrl: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    eventsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    eventsAttending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
// Create a method to follow another user
userSchema.methods.follow = async function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();

    const userToFollow = await User.findById(userId);
    if (userToFollow && !userToFollow.followers.includes(this._id)) {
      userToFollow.followers.push(this._id);
      await userToFollow.save();
    }
  }
};

// Create a method to unfollow another user
userSchema.methods.unfollow = async function (userId) {
  if (this.following.includes(userId)) {
    this.following.pull(userId);
    await this.save();

    const userToUnfollow = await User.findById(userId);
    if (userToUnfollow && userToUnfollow.followers.includes(this._id)) {
      userToUnfollow.followers.pull(this._id);
      await userToUnfollow.save();
    }
  }
};

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
    name: "Tester",
    lastname: "Testesen",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234"),
    followers: [test2._id],
    following: [test2._id],
  });

  console.log(test);

  const test2 = await User.create({
    mail: "test2@test2.dk",
    name: "Tester",
    lastname: "Testesen",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234"),
  });

  const event1 = await Event.create({
    date: new Date(),
    title: "Event 1",
    description: "Description 1",
    location: "55.676098, 12.568337",
    creator: test._id,
    image: "https://source.unsplash.com/random",
    attendees: [test2._id],
  });

  const event2 = await Event.create({
    date: new Date(),
    title: "Event 2",
    description: "Description 2",
    location: "55.676098, 12.568337",
    creator: test._id,
    image: "https://source.unsplash.com/random",
    attendees: [test2._id],
  });
}
