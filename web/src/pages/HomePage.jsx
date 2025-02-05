import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header.jsx";
import EventList from "../components/EventList.jsx";
import TestButton from "../components/ProtectedTestButton.jsx";

const HomePage = () => {
    return (
        <>
            <Header /> {}
            <Container className="text-center my-5">
                <Row>
                    <Col>
                        <h1>
                            Ласкаво просимо до платформи для управління подіями!
                        </h1>
                        <p>
                            Тут ви можете створювати події, керувати ними та
                            брати участь у найкращих заходах.
                        </p>
                        <Button variant="primary" href="/regist">
                            Зареєструватися
                        </Button>{" "}
                        <Button variant="secondary" href="/events">
                            Переглянути події
                        </Button>
                    </Col>
                </Row>
                <EventList />
                <TestButton />
            </Container>
        </>
    );
};

export default HomePage;
