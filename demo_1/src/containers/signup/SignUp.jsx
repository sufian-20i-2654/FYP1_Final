import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import vgback from './video1.mp4'
import usernameIcon from './usernameIcon.png'
import passwordIcon from './passwordIcon.png'
const SignUp = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Password validation to require at least one special character
    const passwordRegex = /.*[!@#\$%\^&\*].*/;
    return passwordRegex.test(password);
  };

  const Register = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;

    if (!isEmailValid(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid(password)) {
      alert('Password must contain at least one special character.');
      return;
    }

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate('/Select');
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (

    <div className="signup-container">
      <video autoPlay loop muted className="signup-video">
        <source src={vgback} type="video/mp4" />
      </video>
      <form onSubmit={Register}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <img src={usernameIcon} alt="Username" className="username-icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={credentials.email}
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;