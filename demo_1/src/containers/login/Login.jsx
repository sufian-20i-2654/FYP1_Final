import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.css';
import vgback from './video1.mp4'
import usernameIcon from './usernameIcon.png'
import passwordIcon from './passwordIcon.png'
const Login = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const Authentication = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // Login successful, you can navigate the user or perform other actions
        console.log('Login successful');
        navigate('/Select')
      } else {
        // Login failed, handle error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="login-video">
        <source src={vgback} type="video/mp4" />
      </video>
      <form onSubmit={Authentication}>
        <div className="input-group">
          <label htmlFor="username">Email</label>
          <img src={usernameIcon} alt="Username" className="username-icon" />
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder='Enter email address'
            value={credentials.username} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <img src={passwordIcon} alt="Password" className="password-icon" />
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder='Enter password'
            value={credentials.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
