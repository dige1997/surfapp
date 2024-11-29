export default function EventCard({ event }) {
  if (!event) {
    return <p>No event found.</p>;
  }

  return (
    <article className="flex m-4  p-4 rounded-xl shadow-lg w-full overflow-hidden flex-col bg-slate-50">
      <img className="rounded-xl" src={event?.image} alt="" />
      <div className="grid grid-cols-3 p-2 ">
        <p>{event?.creator?.name}</p>
        <h2>{event.title}</h2>
        <p>Date: {new Date(event.date).toLocaleDateString("en-GB")}</p>
        <p>Location: {event.location}</p>
        <p className="truncate">Description: {event.description}</p>
        <p className="mt-4 flex items-center font-semibold">
          Likes: {event.attendees?.length || 0}
        </p>
      </div>
    </article>
  );
}
