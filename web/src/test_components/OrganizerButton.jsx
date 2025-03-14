import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { setUserType, getUserType } from "../Auth_api.js";
import { useSelector, useDispatch } from "react-redux";

const OrganizerButton = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Отримуємо тип користувача з Redux store
  const userRole = useSelector((state) => state.auth.role);

  // Якщо тип користувача ще не завантажено, спробуємо його завантажити
  // useEffect(async () => {
  //   if (!userRole) {
  //     const role = await getUserType();
  //     dispatch(setUserRole(role));
  //     //forceRender(); // Ререндер компонента
  //   }
  // }, [dispatch, userRole]);

  const handleBecomeOrganizer = async () => {
    try {
      // Змінюємо тип користувача на "organizer"
      await setUserType("organizer");
      setMessage("User is now an Organizer.");
    } catch (error) {
      setMessage("Failed to update user type: " + error.message);
    }
  };

  return userRole === "client" ? (
    <div>
      <button onClick={handleBecomeOrganizer} className="btn btn-success">
        Become Organizer
      </button>
      {message && <p>{message}</p>}
    </div>
  ) : null;
};

export default OrganizerButton;
