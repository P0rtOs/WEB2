import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// локалізатор
const localizer = momentLocalizer(moment)

const BigCalendar = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events/')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        // Мапимо події у формат, який очікує календар
        const formattedEvents = data.map((event) => {
          const start = moment(`${event.date} ${event.time}`, 'YYYY-MM-DD HH:mm').toDate()
          const end = moment(start).add(event.duration || 60, 'minutes').toDate() // default 60 min

          return {
            title: event.title,
            start,
            end,
            allDay: false,
            resource: event, // можна передати весь об'єкт як resource
          }
        })

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Помилка завантаження подій:', error)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div style={{ height: '600px', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        popup
      />
    </div>
  )
}

export default BigCalendar
