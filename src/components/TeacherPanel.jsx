import React, { useState } from 'react';
import socket from '../socket';
import { useDispatch, useSelector } from 'react-redux';
import { setPoll } from '../store/pollSlice';

export default function TeacherPanel(){
  const dispatch = useDispatch();
  const { current } = useSelector(s => s.poll);

  const [question, setQuestion] = useState('');
  const [opts, setOpts] = useState(['','','','']);
  const [duration, setDuration] = useState(60);

  const createPoll = () => {
    const options = opts.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || options.length < 2) {
      return alert('Please enter a question and at least two options');
    }
    socket.emit('create-poll', { question, options, duration }, (res) => {
      if (res && res.success) {
        dispatch(setPoll(res.poll));
        setQuestion('');
        setOpts(['','','','']);
      } else {
        alert(res.message || 'Unable to create poll');
      }
    });
  };

  const endNow = () => {
    socket.emit('end-poll-now', (res) => {
      if (!res.success) alert(res.message || 'Could not end poll');
    });
  };

  return (
    <div style={{width:'100%'}}>
      <div style={{textAlign:'center'}}>
        <div className="title">Intervue Poll — Teacher</div>
        <div className="subtitle">Create a new poll. Students will see it live and have {duration} seconds to respond.</div>
      </div>

      <div style={{display:'flex', gap:12, marginTop:10}}>
        <input className="input" placeholder="Enter poll question" value={question} onChange={e=>setQuestion(e.target.value)} />
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>
        {opts.map((v,i) => (
          <input key={i} className="input" placeholder={`Option ${i+1}`} value={v} onChange={e => {
            const copy = [...opts]; copy[i]=e.target.value; setOpts(copy);
          }} />
        ))}
      </div>

      <div style={{display:'flex', gap:12, marginTop:12, alignItems:'center'}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <div className="small">Timer (seconds)</div>
          <input className="input" style={{width:100}} type="number" value={duration} onChange={e=>setDuration(Math.max(5, Number(e.target.value || 60)))} />
        </div>

        <button className="oval-btn" onClick={createPoll}>Create Poll</button>

        {current && (
          <button className="oval-btn" style={{background:'#FF5C5C'}} onClick={endNow}>End Poll Now</button>
        )}
      </div>

      <div style={{marginTop:18}}>
        {current ? (
          <div>
            <div style={{fontWeight:700}}>{current.question}</div>
            <div className="small">Live results:</div>
            <div style={{display:'grid', gap:8, marginTop:8}}>
              {current.options.map(opt => (
                <div key={opt.id} className="option">
                  <div style={{display:'flex', gap:12, alignItems:'center'}}>
                    <div style={{width:240}}>{opt.text}</div>
                  </div>
                  <div style={{display:'flex', gap:12, alignItems:'center'}}>
                    <div className="small">{opt.votes} votes</div>
                    <div className="small">({opt.pct}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{textAlign:'center', color:'#777', marginTop:12}}>Wait for the teacher to ask questions..</div>
        )}
      </div>
    </div>
  );
}
