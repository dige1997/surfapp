
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export async function action({ request, params }) {
  // Protect the route
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  // Delete the post
 await mongoose.models.Event.findByIdAndDelete(params.eventId);

  return new Response(null, {
      status: 302,
      headers: {
          location: "/event",
      },
  })
}
