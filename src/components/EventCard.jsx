import { CiEdit } from "react-icons/ci";
import { format, isValid } from "date-fns";

const pick = (event, keys) => {
  for (const key of keys) {
    const value = event?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return null;
};

const Icon = ({ path, className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

const Meta = ({ icon, text, strong = false }) => {
  if (!text) return null;
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
          strong
            ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
            : "bg-slate-100/80 text-slate-500"
        }`}
      >
        {icon}
      </span>
      <span
        className={`truncate text-[11px] ${
          strong ? "font-semibold text-slate-700" : "font-medium text-slate-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

const EventCard = ({ event, onEdit, preview = false }) => {
  const eventTitle =
    pick(event, ["eventTitle", "title", "name"]) || "Untitled Event";
  const eventType = pick(event, ["eventType", "event_type", "type"]);
  const dateValue = pick(event, ["eventDate", "date"]);
  const timeValue = pick(event, ["eventTime", "startTime", "time"]);
  const dressCode = pick(event, ["dressCode", "dress_code"]);
  const venue = pick(event, ["Venue", "venue", "location"]);
  const note = pick(event, [
    "eventNote",
    "note",
    "notes",
    "eventDescription",
    "description",
  ]);

  const parsedDate = dateValue ? new Date(dateValue) : null;
  const validDate = parsedDate && isValid(parsedDate) ? parsedDate : null;
  const month = validDate ? format(validDate, "MMM") : "—";
  const day = validDate ? format(validDate, "dd") : "—";
  const fullDate = validDate ? format(validDate, "EEE, MMM d") : "Date TBD";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/70 bg-gradient-to-br from-white via-white to-indigo-50/40 p-3 shadow-[0_8px_20px_-10px_rgba(79,70,229,0.28)] ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(79,70,229,0.35)]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/25 via-fuchsia-300/15 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="relative flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-[1px] shadow-sm shadow-indigo-500/20">
          <div className="flex h-12 w-11 flex-col items-center justify-center rounded-[7px] bg-white/95 leading-none">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
              {month}
            </span>
            <span className="mt-0.5 text-base font-extrabold text-slate-800">
              {day}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {eventType && (
                <span className="inline-flex max-w-full items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-100">
                  <span className="truncate">{eventType}</span>
                </span>
              )}
              <h3
                className="mt-1 truncate text-[14px] font-bold leading-snug text-slate-800"
                title={eventTitle}
              >
                {eventTitle}
              </h3>
            </div>

            {preview ? (
              <span className="shrink-0 rounded-full bg-indigo-600/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-200/60">
                Preview
              </span>
            ) : (
              <button
                aria-label="Edit event"
                onClick={() => onEdit?.(event?._id)}
                className="shrink-0 rounded-lg bg-white/80 p-1.5 text-slate-400 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <CiEdit size={15} />
              </button>
            )}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
            <Meta
              strong
              icon={<Icon className="h-3.5 w-3.5" path={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />} />}
              text={fullDate}
            />
            <Meta
              icon={<Icon className="h-3.5 w-3.5" path={<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} />}
              text={timeValue || "Time TBD"}
            />
            <Meta
              icon={<Icon className="h-3.5 w-3.5" path={<><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />}
              text={venue || "Venue TBD"}
            />
            <Meta
              icon={<Icon className="h-3.5 w-3.5" path={<path d="M12 3l2 3 3 1-2 3v9a1 1 0 01-1 1h-4a1 1 0 01-1-1v-9L7 7l3-1 2-3z" />} />}
              text={dressCode || "Dress code TBD"}
            />
          </div>
        </div>
      </div>

      {note && (
        <p className="relative mt-2 line-clamp-1 border-t border-slate-100/80 pt-2 text-[11px] leading-relaxed text-slate-500">
          <span className="font-medium text-slate-600">Note: </span>
          {note}
        </p>
      )}
    </article>
  );
};

export default EventCard;