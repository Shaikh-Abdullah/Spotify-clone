import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faUser,
  faCaretDown,
  faPlay,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { useSongs } from '../../contextAPI/SongContext';
import { getCoverUrl } from '../../services/api';
import '../../assets/styles/MainContent.css';

const MainContent = () => {
  const { songs, topTracks, playSong, currentSong } = useSongs();
  const [showSidebar, setShowSidebar] = useState(false);

  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString();

  let greeting = "";
  if (timeString < "12:00:00") {
    greeting = "Good Morning";
  } else if (timeString < "18:00:00") {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // Update background color based on current song
  useEffect(() => {
    if (currentSong?.accent) {
      document.body.style.background = `linear-gradient(180deg, ${currentSong.accent}80 0%, #121212 100%)`;
    } else {
      document.body.style.background = 'linear-gradient(180deg, #404040 0%, #121212 100%)';
    }

    return () => {
      document.body.style.background = '#121212';
    };
  }, [currentSong]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar?.classList.toggle('show');
    overlay?.classList.toggle('show');
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <div className="main-content">
        <header className="content-header">
          <div className="header-buttons">
            <button className="nav-btn menu-btn" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button className="nav-btn">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="nav-btn">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="user-menu">
            <button className="user-btn">
              <span className="avatar">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className="username">Your Name</span>
              <FontAwesomeIcon icon={faCaretDown} />
            </button>
          </div>
        </header>
        
        <main className="content-area">
          <h1>{greeting}</h1>
          <div className="featured-content">
            {topTracks && topTracks.slice(0, 6).map((song) => (
              <div
                key={song.id}
                className="featured-item"
                onClick={() => playSong(song)}
              >
                <div className="item-image">
                  <img src={getCoverUrl(song.cover)} alt={song.name} />
                </div>
                <div className="item-info">
                  <h3>{song.name}</h3>
                  <span className="item-subtitle">By {song.artist}</span>
                </div>
                <button className="play-button">
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </div>
            ))}
          </div>

          <section className="made-for-you">
            <div className="section-header">
              <h2>All Songs</h2>
              <button className="show-all">Show all</button>
            </div>
            <div className="card-grid">
              {songs && songs.map((song) => (
                <div
                  key={song.id}
                  className="card"
                  onClick={() => playSong(song)}
                >
                  <div className="card-image">
                    <img src={getCoverUrl(song.cover)} alt={song.name} />
                    <button className="play-button">
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  </div>
                  <h4>{song.name}</h4>
                  <p>By {song.artist}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MainContent;
