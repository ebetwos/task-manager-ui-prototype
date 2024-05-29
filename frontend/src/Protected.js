// src/Protected.js
import React, { useEffect, useState } from 'react';

function Protected() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/protected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
      } else {
        setMessage('Failed to fetch protected resource');
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Protected Resource</h2>
      <p>{message}</p>
    </div>
  );
}

export default Protected;
