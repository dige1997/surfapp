import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "./tailwind.css";
import Nav from "./components/Nav";
import { authenticator } from "./services/auth.server";
import NavAll from "./components/NavAll";
import Footer from "./components/footer";

export function links() {
  return [{ rel: "stylesheet", href: stylesheet }];
}
export async function loader({ request }) {
  return await authenticator.isAuthenticated(request);
}

export default function App() {
  const user = useLoaderData();
  return (
    <html
      lang="en"
      className="bg-gradient-to-t from-blue-50 to-cyan-200 bg-cover bg-no-repeat min-h-screen"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="">
        {user ? <Nav user={user} /> : <NavAll />}

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}
