import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey" // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail");
    let password = form.get("password");

    // do some validation, errors are saved in the sessionErrorKey
    if (!mail || typeof mail !== "string" || !mail.trim()) {
      throw new AuthorizationError("Email is required and must be a string");
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      throw new AuthorizationError("Password is required and must be a string");
    }

    // verify the user
    const user = await verifyUser({ mail, password });
    if (!user) {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("User not found");
    }
    console.log(user);
    return user;
  }),
  "user-pass"
);

async function verifyUser({ mail, password }) {
  const user = await mongoose.models.User.findOne({ mail }).select("+password");
  if (!user) {
    throw new AuthorizationError("No user found with this email.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthorizationError("Invalid password.");
  }
  // Remove the password from the user object before returning it
  user.password = undefined;
  return user;
}
