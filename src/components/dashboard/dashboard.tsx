import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
    }
  return (
    <div>
        <h1 className='text-center mb-3'>Dashboard</h1>
        <div className='text-center'><button className="bg-teal-800 text-white" onClick={ logout }>Logout</button></div>
    </div>
  )
}
