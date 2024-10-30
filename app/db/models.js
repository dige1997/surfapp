import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ========== models ========== //

// Create a user schema
const userSchema = new mongoose.Schema(
  {
    image: String,
    mail: {
      type: String,
      required: true, // Ensure user emails are required
      unique: true, // Ensure user emails are unique
    },
    name: String,
    lastname: String, // New field for last name
    password: {
      type: String,
      required: true, // Ensure user passwords are required
      select: false, // Automatically exclude from query results
    },
    hobbies: [String], // Array of strings for hobbies
  },
  { timestamps: true }
);

// pre-save password hook
userSchema.pre("save", async function (next) {
  const user = this; // this refers to the user document

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next(); // continue
  }

  const salt = await bcrypt.genSalt(10); // generate a salt
  user.password = await bcrypt.hash(user.password, salt); // hash the password
  next(); // continue
});

// create a post schema
const postSchema = new mongoose.Schema(
  {
    caption: String,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: Number,
    tags: [String],
  },
  { timestamps: true }
);

export const models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Post", schema: postSchema, collection: "posts" },
];

// ========== initData ========== //

export async function initData() {
  // check if data exists
  const userCount = await mongoose.models.User.countDocuments();
  const postCount = await mongoose.models.Post.countDocuments();

  if (userCount === 0 || postCount === 0) {
    await insertData();
  }
}

// ========== insertData ========== //

async function insertData() {
  const User = mongoose.models.User;
  const Post = mongoose.models.Post;

  console.log("Dropping collections...");
  await User.collection.drop();
  await Post.collection.drop();

  console.log("Inserting data...");
  // Insert users
  const nicolai = await User.create({
    image:
      "https://www.baaa.dk/media/b5ahrlra/maria-louise-bendixen.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921650330000&format=webp",
    mail: "test@test.com",
    name: "Nicolai",
    lastname: "Doe", // Example last name
    password: "1234",
    hobbies: ["Surf", "Ski"], // Example hobbies
  });
}
