export default function UserAvatar({ user }) {
  return (
    <div className="avatar">
      <img src={user.image} alt={user.name} />
      <span>
        <h3>{user.name}</h3>
        <p>{user.title}</p>
      </span>
    </div>
  );
}
