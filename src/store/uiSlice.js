import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    role: null, // 'teacher' or 'student'
    name: null,
    tabId: null
  },
  reducers: {
    setRole(state, action) { state.role = action.payload; },
    setName(state, action) { state.name = action.payload; },
    setTabId(state, action) { state.tabId = action.payload; }
  }
});

export const { setRole, setName, setTabId } = uiSlice.actions;
export default uiSlice.reducer;
