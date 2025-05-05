import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { apiEvents } from "../Auth_api.js";
import { useNavigate } from "react-router";
// локалізатор
const localizer = momentLocalizer(moment)

const BigCalendar = () => {

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('month')


    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      apiEvents
        .get("/")
        .then((res) => {
          const mappedEvents = res.data.map((event) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            allDay: false,
            resource: event, // весь об'єкт доступний при кліку
          }))
          setEvents(mappedEvents)
        })
        .catch((err) => console.error("Failed to fetch events:", err))
    }, [])

  return (
    <div style={{ height: '900px', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        date={currentDate}
        view={currentView}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(view) => setCurrentView(view)}
        onSelectEvent={(event) => {
          navigate(`/events/${event.id}`);}}
        popup
      />
    </div>
  )
}

export default BigCalendar
