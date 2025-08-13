import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import { useSelector, useDispatch } from 'react-redux';
import { setPoll, updateResults } from '../store/pollSlice';
import { setName } from '../store/uiSlice';

export default function StudentPanel(){
  const dispatch = useDispatch();
  const { current } = useSelector(s => s.poll);
  const { tabId, name } = useSelector(s => s.ui);

  const [localName, setLocalName] = useState(name || '');
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // fetch current
    socket.emit('get-current-poll', (res) => {
      if (res && res.poll) {
        dispatch(setPoll(res.poll));
        setRemaining(res.remaining || 0);
      }
    });

    socket.on('new-poll', (poll) => {
      dispatch(setPoll(poll));
      setHasSubmitted(false);
      setSelectedOption(null);
      setRemaining(poll.duration || 60);
      startTimer(poll.duration || 60);
    });

    socket.on('poll-update', (poll) => {
      dispatch(updateResults(poll));
    });

    socket.on('poll-ended', (payload) => {
      dispatch(updateResults(payload.poll));
      setRemaining(0);
      setHasSubmitted(true); // show results
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    });

    return ()=> {
      socket.off('new-poll');
      socket.off('poll-update');
      socket.off('poll-ended');
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, []);

  useEffect(() => {
    // persist name per-tab using localStorage key per tab
    if (tabId && localName) {
      localStorage.setItem(`poll_name_${tabId}`, localName);
      dispatch(setName(localName));
    }
  }, [localName, tabId]);

  useEffect(()=> {
    // when poll becomes available set timer from server remaining if provided
    if (current && current.total !== undefined) {
      // don't overwrite existing remaining if already counting
    }
  }, [current]);

  function startTimer(seconds) {
    setRemaining(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // show results even if not submitted
          setHasSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const submitAnswer = (optId) => {
    if (!localName || !localName.trim()) return alert('Enter your name first');
    if (!current) return alert('No active poll');
    // studentId unique per tab + name - prevents duplicate from same tab
    const studentId = `${tabId}::${localName.trim()}`;
    socket.emit('vote', { pollId: current.id, optionId: optId, studentId, studentName: localName.trim() }, (res) => {
      if (res && res.success) {
        setHasSubmitted(true);
        setSelectedOption(optId);
      } else {
        alert(res.message || 'Vote failed');
      }
    });
  };

  const onEnterName = () => {
    if (!localName.trim()) return alert('Enter a name');
    // store already saved by useEffect
    alert('Name saved for this tab');
  };

  return (
    <div style={{width:'100%'}}>
      <div style={{textAlign:'center'}}>
        <div className="title">Let's Get Started</div>
        <div className="subtitle">If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates</div>
      </div>

      <div style={{marginTop:8, width:'100%'}}>
        <div style={{display:'flex', gap:10}}>
          <input className="input" placeholder="Enter your Name" value={localName} onChange={e => setLocalName(e.target.value)} />
          <button className="oval-btn" onClick={onEnterName}>continue</button>
        </div>

        <div style={{marginTop:14}}>
          {!current && <div style={{color:'#777'}}>Wait for the teacher to ask questions..</div>}
          {current && (
            <div>
              <div style={{fontWeight:700}}>{current.question}</div>
              <div className="small">Time remaining: {remaining}s</div>

              <div style={{display:'grid', gap:8, marginTop:10}}>
                {current.options.map(opt => (
                  <div key={opt.id} className="option" style={{cursor: hasSubmitted ? 'default' : 'pointer', opacity: hasSubmitted ? 0.8 : 1}} onClick={() => {
                    if (hasSubmitted) return;
                    submitAnswer(opt.id);
                  }}>
                    <div style={{display:'flex', gap:12, alignItems:'center'}}>
                      <input type="radio" name="opt" checked={selectedOption === opt.id} readOnly />
                      <div className="opt-text">{opt.text}</div>
                    </div>

                    <div style={{display:'flex', gap:12, alignItems:'center'}}>
                      <div style={{minWidth:60, textAlign:'right'}} className="small">{opt.votes} votes</div>
                      <div style={{width:120}} className="small">{opt.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>

              {hasSubmitted && (
                <div style={{marginTop:10}}>
                  <div className="small">Live results (you can't change after submitting)</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
