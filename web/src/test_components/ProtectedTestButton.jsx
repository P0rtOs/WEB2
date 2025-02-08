import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfile } from '../Auth_api.js';

const ProtectedButton = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Calling a protected endpoint
      await getUserProfile();
      setMessage('ВСЕ ГУД');
    } catch (error) {
      setMessage('НЕМА ТОКЕНА');
      // Optionally, redirect to login if the token refresh fails:
      // navigate("/login");
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Перевірити авторизацію</button>
      <p>{message}</p>
    </div>
  );
};

export default ProtectedButton;
