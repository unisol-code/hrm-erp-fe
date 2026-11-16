import Button from "./Button";
import EventCard from "./EventCard";

const EventsCarousel = ({ events = [], onEdit, onAdd }) => {
  if (events.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-sm font-medium text-slate-500">No upcoming events</p>
        <Button onClick={onAdd} variant={2} text="Add event" />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full">
      <div className="flex h-full flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3 scrollbar-hide">
        {events.map((event) => (
          <div key={event._id || event.id} className="w-full shrink-0">
            <EventCard event={event} onEdit={onEdit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsCarousel;
