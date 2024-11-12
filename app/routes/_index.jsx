import { authenticator } from "../services/auth.server";

export const meta = () => {
  return [{ title: "Elevation" }];
};

export async function loader({ request }) {
  // return redirect("/posts");
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/main-dashboard",
  });
}
