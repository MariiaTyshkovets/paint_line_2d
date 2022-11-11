import { configureStore } from '@reduxjs/toolkit';
import linesReducer from './linesSlice';

const store = configureStore({
  reducer: {
    lines: linesReducer
  },
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;