import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import EventList from "../components/EventList";

const HomePage = () => {
  return (
    <>
      <Header /> {}
      <Container className="text-center my-5">
        <Row>
          <Col>
            <h1>Ласкаво просимо до платформи для управління подіями!</h1>
            <p>
              Тут ви можете створювати події, керувати ними та брати участь у найкращих заходах.
            </p>
            <Button variant="primary" href="/register">
              Зареєструватися
            </Button>{" "}
            <Button variant="secondary" href="/events">
              Переглянути події
            </Button>
          </Col>
        </Row>
        <EventList />
      </Container>
    </>
  );
};

export default HomePage;
