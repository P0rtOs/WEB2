import React from "react";
import EventList from "../components/EventList_Big";

const EventPage = ({ userRole }) => {
  const isAdmin = userRole === "admin";

  return (
    <div>
      <h1>Список подій</h1>
      <EventList isAdmin={isAdmin} />
    </div>
  );
};

export default EventPage;
