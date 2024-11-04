import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  return user;
}

export default function Profile() {
  const user = useLoaderData();
  return (
    <div className="page">
      <p>
        Name: {user.name} &nbsp;
        {user.lastname}
      </p>
      <p>Mail: {user.mail}</p>
      <p>Your sports: {user.hobbies.join(", ")}</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}
