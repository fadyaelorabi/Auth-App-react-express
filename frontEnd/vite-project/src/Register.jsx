import React, { useState } from 'react'; // Added useState import
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';

const Register = () => {
    const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  }); 

const navigate = useNavigate();  // Create navigate function to programmatically navigate
 
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8081/register', values);
    
    // Log the response to see what it contains
    console.log(response.data);
    
    // If you want to alert it as a string
    alert(JSON.stringify(response.data, null, 2));
    navigate('/login'); // Navigate to the login page

  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.message || "Registration failed!";
      const errorStatus = error.response.status;
      alert(`Error ${errorStatus}: ${errorMessage}`);
    } else if (error.request) {
      alert("Network error. Please try again later.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
    console.error("Error details:", error);
  }
};


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor="name" className="form-label"><strong>Full Name</strong></label>
                  <input
                    type="text"
                    placeholder='Enter Full Name'
                    name='name'
                    className='form-control rounded-0'
                    required
                    onChange={e => setValues({ ...values, name: e.target.value })}

                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor="email" className="form-label"><strong>Email</strong></label>
                  <input
                    type="email"
                    placeholder='Enter Email'
                    name='email'
                    className='form-control rounded-0'
                    required
                    onChange={e => setValues({ ...values, email: e.target.value })}

                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                  <input
                    type="password"
                    placeholder='Enter Password'
                    name='password'
                    className='form-control rounded-0'
                    required
                    onChange={e => setValues({ ...values, password: e.target.value })}

                  />
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0 mb-3'>
                  Register
                </button>
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;