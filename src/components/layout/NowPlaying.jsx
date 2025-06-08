import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faVolumeMute,
  faVolumeDown
} from '@fortawesome/free-solid-svg-icons';
import { useSongs } from '../../contextAPI/SongContext';
import { getCoverUrl } from '../../services/api';
import '../../assets/styles/NowPlaying.css';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const NowPlaying = () => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    nextSong,
    previousSong,
    updateProgress,
    updateDuration
  } = useSongs();

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong && audio) {
      audio.src = currentSong.url;
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback error:", error);
          });
        }
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        updateProgress(audio.currentTime);
      };

      const handleDurationChange = () => {
        updateDuration(audio.duration);
      };

      const handleEnded = () => {
        nextSong();
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [updateProgress, updateDuration, nextSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      updateProgress(newTime);
    }
  };

  const handleVolumeClick = (e) => {
    const volumeBar = e.currentTarget;
    const clickPosition = (e.pageX - volumeBar.getBoundingClientRect().left) / volumeBar.offsetWidth;
    setVolume(clickPosition);
    if(audioRef.current) {
      audioRef.current.volume = clickPosition;
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if(audioRef.current){
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted])

  return (
    <div className="now-playing">
      <audio ref={audioRef} />
      
      {currentSong && (
        <>
          <div className="track-info">
            <div className="track-image">
              <img src={getCoverUrl(currentSong.cover)} alt={currentSong.name} />
            </div>
            <div className="track-details">
              <h4 className="track-name">{currentSong.name}</h4>
              <p className="track-artist">{currentSong.artist}</p>
            </div>
          </div>

          <div className="player-controls">
            <div className="progress-container">
              <span className="progress-time">{formatTime(progress)}</span>
              <div className="progress-bar" onClick={handleProgressClick}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
              <span className="progress-time">{formatTime(duration)}</span>
            </div>

            <div className="control-buttons">
              <button className="control-button" onClick={previousSong}>
                <FontAwesomeIcon icon={faStepBackward} />
              </button>
              <button className="play-pause-button" onClick={togglePlay}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <button className="control-button" onClick={nextSong}>
                <FontAwesomeIcon icon={faStepForward} />
              </button>
            </div>
          </div>

          <div className="volume-controls">
            <button>
              <FontAwesomeIcon 
                icon={isMuted || volume === 0 ? faVolumeMute : 
                      volume < 0.5 ? faVolumeDown : faVolumeUp
              } className="volume-icon" />
            </button>
            <div className="volume-slider" onClick={handleVolumeClick}>
              <div className="volume-fill" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NowPlaying;