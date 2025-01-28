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
    postsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    postsLiked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
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

    const userToFollow = await mongoose.models.User.findById(userId);
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

    const userToUnfollow = await mongoose.models.User.findById(userId);
    if (userToUnfollow && userToUnfollow.followers.includes(this._id)) {
      userToUnfollow.followers.pull(this._id);
      await userToUnfollow.save();
    }
  }
};

const User = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Add a text index for search functionality
postSchema.index({ title: "text", description: "text" });

// Pre-save hook for hashing passwords
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user.name = user.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  next();
});

// Pre-save hook for posts
postSchema.pre("save", async function (next) {
  const post = this;

  post.title = post.title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const creator = await mongoose.models.User.findById(post.creator);
  if (creator && !creator.postsCreated.includes(post._id)) {
    creator.postsCreated.push(post._id);
    await creator.save();
  }

  next();
});

const Post = mongoose.model("Post", postSchema);

export const models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Post", schema: postSchema, collection: "posts" },
];

// ========== initData ========== //

export async function initData() {
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
  await Promise.all([
    mongoose.connection.dropCollection("users").catch(() => {}),
    mongoose.connection.dropCollection("posts").catch(() => {}),
  ]);

  console.log("Inserting data...");

  const test = await User.create({
    mail: "test@test.dk",
    name: "Tester",
    lastname: "Testesen",
    password: await hashPassword("1234"),
    followers: [],
    following: [],
  });

  const test2 = await User.create({
    mail: "test2@test2.dk",
    name: "Tester",
    lastname: "Testesen",
    password: await hashPassword("1234"),
    followers: [test._id],
    following: [test._id],
  });

  await Post.create([
    {
      date: new Date(),
      title: "Post 1",
      description: "Description 1",
      location: "55.676098, 12.568337",
      creator: test._id,
      image: "https://source.unsplash.com/random",
      likes: [test2._id],
    },
    {
      date: new Date(),
      title: "Post 2",
      description: "Description 2",
      location: "55.676098, 12.568337",
      creator: test._id,
      image: "https://source.unsplash.com/random",
      likes: [test2._id],
    },
  ]);
}
