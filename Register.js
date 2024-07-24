import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate("/login")
      const userData = await registerUser(email, password, username);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSub = async (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <button type="submit">Register</button>
        <button type="submit">Назад</button>
      </form>
    </div>
  );
}

export default Register;
