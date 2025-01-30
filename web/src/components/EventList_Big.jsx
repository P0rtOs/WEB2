import React, { useState, useEffect } from "react";
import "../css/EventList_Big.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const EventList_Big = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/events/");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`event-list-big ${isExpanded ? "expanded" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Event List</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event, index) => (
            <tr key={event.id}>
              <td>{index + 1}</td>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{new Date(event.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredEvents.length === 0 && (
        <p className="text-center">No events found.</p>
      )}
    </div>
  );
};

export default EventList_Big;
