import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/events/"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            }
        };

        fetchEvents();
    }, []);

    return (
        <Row className="mt-4">
            {events.map((event) => (
                <Col key={event.id} md={6} lg={4} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>{event.title}</Card.Title>
                            <Card.Text>
                                <strong>Дата:</strong> {event.date}
                                <br />
                                <strong>Час:</strong> {event.time}
                                <br />
                                <strong>Місце:</strong> {event.location}
                                <br />
                                <strong>Опис:</strong> {event.description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default EventList;
