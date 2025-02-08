import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { setUserType } from '../Auth_api.js';

const BecomeOrganizerButton = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleBecomeOrganizer = async () => {
    try {
      // Update the user's type to "organizer"
      await setUserType('organizer');
      setMessage('User is now an Organizer.');
    } catch (error) {
      setMessage('Failed to update user type: ' + error.message);
      // Optionally, navigate to login if needed:
      // navigate("/login");
    }
  };

  return (
    <button onClick={handleBecomeOrganizer} className='btn btn-success'>
      Become Organizer
    </button>
  );
};

export default BecomeOrganizerButton;
