import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { apiEvents } from "../Auth_api";
import { useNavigate } from "react-router";

const localizer = momentLocalizer(moment);
const EVENT_TYPES = ["meetup", "conference", "workshop", "webinar"];

const BigCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [selectedType, setSelectedType] = useState("Всі");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiEvents
      .get("/")
      .then((res) => {
        const mappedEvents = res.data.map((event) => ({
          id: event.id,
          title: event.title,
          type: event.event_type,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: false,
          resource: event,
        }));
        setEvents(mappedEvents);
      })
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const eventsToShow =
    selectedType === "Всі"
      ? events
      : events.filter((event) => event.type === selectedType);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <strong>Фільтр подій:</strong>{" "}
        <button
          onClick={() => setSelectedType("Всі")}
          style={{ fontWeight: selectedType === "Всі" ? "bold" : "normal" }}
        >
          Всі
        </button>
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{ fontWeight: selectedType === type ? "bold" : "normal" }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ height: "900px", padding: "1rem" }}>
        <Calendar
          localizer={localizer}
          events={eventsToShow}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          date={currentDate}
          view={currentView}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCurrentView(view)}
          onSelectEvent={(event) => {
            navigate(`/events/${event.id}`);
          }}
          popup
        />
      </div>
    </div>
  );
};

export default BigCalendar;
