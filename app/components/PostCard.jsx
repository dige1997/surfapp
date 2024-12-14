import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <UserAvatar user={post.user} />
      <img src={post.image} alt={post.caption} />
      <h3>{post.caption}</h3>
    </article>
  );
}
