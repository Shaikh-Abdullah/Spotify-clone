import React from 'react';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import NowPlaying from './components/layout/NowPlaying';
import { SongProvider } from './contextAPI/SongContext';
import './assets/styles/App.css';

function App() {
  return (
    <SongProvider>
      <div className="app">
        <Sidebar />
        <MainContent />
        <NowPlaying />
      </div>
    </SongProvider>
  );
}

export default App;
