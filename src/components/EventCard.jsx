import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

const getVisibilityBadge = (status) => {
  switch (status) {
    case "public":
      return <span className="event-badge badge-public">Public</span>;
    case "shared":
      return <span className="event-badge badge-shared">Shared</span>;
    case "private":
    default:
      return <span className="event-badge badge-private">Private</span>;
  }
};

const EventCard = ({ event }) => {
  const fullDateTime = event.date ? event.date.toDate() : null;
  const displayDate = fullDateTime
    ? fullDateTime.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : "N/A";
  const displayTime = fullDateTime
    ? fullDateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "N/A";

  const cardClass =
    event.visibility === "public"
      ? "event-card event-public"
      : event.visibility === "shared"
      ? "event-card event-shared"
      : "event-card event-private";

  return (
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className={cardClass}>
        <div className="event-card-grid">
          <div className="event-card-header">
            <h1 className="event-card-title">{event.title}</h1>
            {getVisibilityBadge(event.visibility)}
          </div>

          <div className="event-info">
            <p className="date-text">📅 DATE: {displayDate}</p>
          </div>

          <div className="event-info">
            <p className="time-text">⏰ TIME: {displayTime}</p>
          </div>

          <div className="event-info">
            <p className="location-text">📍 LOCATION: {event.location || "Not Specified"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

