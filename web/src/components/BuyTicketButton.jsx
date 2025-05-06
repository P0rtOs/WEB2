import React from "react";
import axios from "axios";
import { stripePromise } from "../stripe";

export default function BuyTicketButton({ tierId }) {
  const handleClick = async () => {
    // 1) Создаем Session
    const { data } = await axios.post("/api/events/create-checkout-session/", {
      tier_id: tierId,
    });

    // 2) Редиректим
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });
    if (error) console.error(error);
  };

  return <button onClick={handleClick}>Купить билет</button>;
}
