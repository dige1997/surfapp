import { NavLink } from "@remix-run/react";

export default function Nav() {
  return (
    <nav className="bg-slate-500">
      <NavLink to="/dashboard">Posts</NavLink>
      <NavLink to="/add-post">Add Post</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
}
