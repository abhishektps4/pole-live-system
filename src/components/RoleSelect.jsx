import React from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/uiSlice';

export default function RoleSelect(){
  const dispatch = useDispatch();
  return (
    <>
      <div style={{textAlign:'center'}}>
        <div className="title">Intervue Poll</div>
        <div className="subtitle">Welcome to the Live Polling System. Please select the role that best describes you to begin using the live polling system</div>
      </div>

      <div className="main-grid" style={{marginTop:8}}>
        <div className="role-card" onClick={() => dispatch(setRole('student'))}>
          <div className="r-title">I'm a Student</div>
          <div className="r-desc">Submit answers and view live poll results in real-time.</div>
        </div>

        <div className="role-card" onClick={() => dispatch(setRole('teacher'))}>
          <div className="r-title">I'm a Teacher</div>
          <div className="r-desc">Create polls, view live results, and control the session.</div>
        </div>
      </div>

      <div style={{marginTop:18, display:'flex', justifyContent:'center'}}>
        <button className="oval-btn">continue</button>
      </div>
    </>
  );
}
