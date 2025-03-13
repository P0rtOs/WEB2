import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { setUserType } from '../Auth_api.js';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserType } from '../redux/actions/userActions';

const OrganizerButton = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Отримуємо тип користувача з Redux store
  const userType = useSelector((state) => state.user.userType);

  // Якщо тип користувача ще не завантажено, спробуємо його завантажити
  useEffect(() => {
    if (!userType) {
      dispatch(fetchUserType());
    }
  }, [dispatch, userType]);

  const handleBecomeOrganizer = async () => {
    try {
      // Змінюємо тип користувача на "organizer"
      await setUserType('organizer');
      setMessage('User is now an Organizer.');
    } catch (error) {
      setMessage('Failed to update user type: ' + error.message);
    }
  };

  // Рендеримо кнопку тільки якщо користувач має тип "user"
  if (userType !== 'user') {
    return null;
  }

  return (
    <div>
      <button onClick={handleBecomeOrganizer} className="btn btn-success">
        Become Organizer
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrganizerButton;
