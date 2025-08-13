import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null, // poll object: {id, question, options: [{id,text,votes,pct}], total}
  remaining: 0,
  previous: []
};

const slice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll(state, action) {
      state.current = action.payload;
    },
    updateResults(state, action) {
      state.current = action.payload;
    },
    endPoll(state, action) {
      state.previous.unshift(action.payload.poll);
      state.current = null;
      state.remaining = 0;
    },
    setRemaining(state, action) {
      state.remaining = action.payload;
    },
    setPrevious(state, action) {
      state.previous = action.payload;
    }
  }
});

export const { setPoll, updateResults, endPoll, setRemaining, setPrevious } = slice.actions;
export default slice.reducer;
