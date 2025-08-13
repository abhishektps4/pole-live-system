import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPoll, updateResults, endPoll, setRemaining } from './store/pollSlice';
import { setRole, setName, setTabId } from './store/uiSlice';
import socket from './socket';
import RoleSelect from './components/RoleSelect';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const dispatch = useDispatch();
  const role = useSelector(s => s.ui.role);
  const name = useSelector(s => s.ui.name);
  const tabId = useSelector(s => s.ui.tabId);

  // initialize tab id (sessionStorage so it's per-tab) and restore stored name (localStorage keyed by tab)
  useEffect(() => {
    let tid = sessionStorage.getItem('poll_tab_id');
    if (!tid) {
      tid = uuidv4();
      sessionStorage.setItem('poll_tab_id', tid);
    }
    dispatch(setTabId(tid));
    const storedName = localStorage.getItem(`poll_name_${tid}`);
    if (storedName) dispatch(setName(storedName));
  }, []);

  // socket handlers
  useEffect(() => {
    socket.on('new-poll', data => {
      dispatch(setPoll(data));
      // remaining will be fetched
    });
    socket.on('poll-update', data => {
      dispatch(updateResults(data));
    });
    socket.on('poll-ended', (payload) => {
      dispatch(endPoll(payload));
    });

    // fetch current poll on load
    socket.emit('get-current-poll', (res) => {
      if (res && res.poll) {
        dispatch(setPoll(res.poll));
        dispatch(setRemaining(res.remaining || 0));
      }
    });

    return () => {
      socket.off('new-poll');
      socket.off('poll-update');
      socket.off('poll-ended');
    };
  }, []);

  return (
    <div className="app">
      <div className="center-card" role="main" aria-label="Intervue Poll — main card">
        {!role && <RoleSelect />}
        {role === 'teacher' && <TeacherPanel />}
        {role === 'student' && <StudentPanel />}
      </div>
    </div>
  );
}
