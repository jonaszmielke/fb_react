import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './signup.css'

function SingUpPage() {

  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password1, setPassword1] = useState(null);
  const [password2, setPassword2] = useState(null);
  const navigate = useNavigate();

  const submitForm = async () => {
    const wrong_data = document.getElementById('wrong-data');
    if (password1 !== password2) {
      wrong_data.style.display = 'block';
      wrong_data.innerText = 'passwords are not identical';
    } else {
      const request = await fetch('http://localhost:3000/unauth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          surname: surname,
          email: email,
          password: password1,
        }),
      });

      await request.json();

      if (request.ok) {
        alert('successfully signed up!');
        navigate('/');
      } else {
        wrong_data.style.display = 'block';
        wrong_data.innerText = 'something went wrong';
      }
    }
  };

  return (
    <div className='signup-page'>
      <form className='signup-form' onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}>

          <h1 className='signup-h1'>Sign up</h1>

          <label className='signup-label' htmlFor='name'>Name</label>
          <input 
            className='signup-input'
            type='text' 
            id='name' 
            value={name || ''} 
            onChange={(e) => setName(e.target.value)} 
            required
          />

          <label className='signup-label' htmlFor='surname'>Surname</label>
          <input 
            className='signup-input'
            type='text' 
            id='surname' 
            value={surname || ''} 
            onChange={(e) => setSurname(e.target.value)} 
            required
          />

          <label className='signup-label' htmlFor='email'>Email</label>
          <input 
            className='signup-input'
            type='email' 
            id='email' 
            value={email || ''} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />

          <label className='signup-label' htmlFor='password1'>Password</label>
          <input 
            className='signup-input'
            type='password' 
            id='password1' 
            value={password1 || ''} 
            onChange={(e) => setPassword1(e.target.value)} 
            required
          />

          <label className='signup-label' htmlFor='password2'>Confirm Password</label>
          <input 
            className='signup-input confirm-password'
            type='password' 
            id='password2'
            value={password2 || ''} 
            onChange={(e) => setPassword2(e.target.value)} 
            required
          />
          <p className='wrong-data' id='wrong-data'></p>
          <button type='submit' className='signup-button'>Create account</button>
      </form>  
    </div>
  )
}

export default SingUpPage