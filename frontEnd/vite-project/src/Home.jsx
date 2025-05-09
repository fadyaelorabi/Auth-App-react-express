import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    axios.defaults.withCredentials = true;
    
    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if(res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout')
            .then(res => {
                if (res.data.message === 'Logged out successfully') {
                    setAuth(false);
                    setName('');
                    setMessage('You have been logged out.');
                }
            })
            .catch(err => console.log('Logout error:', err));
    };

    return (
        <div className="container mt-4">
            {auth ? (
                <div>
                    <h3>You are Authorized --- {name}</h3>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h3>{message}</h3>
                    <h3>Login Now</h3>
                    <Link to="/login" className='btn btn-primary'>Login</Link>
                </div>
            )}
        </div>
    );
}

export default Home;
