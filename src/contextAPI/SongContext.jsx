import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchSongs } from '../services/api';

const SongContext = createContext();

export const useSongs = () => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error('useSongs must be used within a SongProvider');
    }
    return context;
};

export const SongProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        const loadSongs = async () => {
            try {
                const songsData = await fetchSongs();
                console.log('Songs loaded:', songsData);
                setSongs(songsData);
                // Set top tracks as the first 6 songs for now
                // You can modify this logic based on your requirements
                setTopTracks(songsData.filter(song => song.top_track));
                if (songsData && songsData.length > 0) {
                    setCurrentSong(songsData[0]);
                }
            } catch (error) {
                console.error('Error loading songs:', error);
            }
        };

        loadSongs();
    }, []);

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setProgress(0); // Reset progress when new song starts
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        if (!currentSong || !songs.length) return; // Guard clause
        
        try {
            const currentIndex = songs.findIndex(song => song.id === currentSong.id);
            const nextIndex = (currentIndex + 1) % songs.length;
            setCurrentSong(songs[nextIndex]);
            setProgress(0); // Reset progress for new song
        } catch (error) {
            console.error('Error in nextSong:', error);
        }
    };

    const previousSong = () => {
        if (!currentSong || !songs.length) return; // Guard clause
        
        try {
            const currentIndex = songs.findIndex(song => song.id === currentSong.id);
            const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
            setCurrentSong(songs[previousIndex]);
            setProgress(0); // Reset progress for new song
        } catch (error) {
            console.error('Error in previousSong:', error);
        }
    };

    const updateProgress = (time) => {
        setProgress(time);
    };

    const updateDuration = (time) => {
        setDuration(time);
    };

    return (
        <SongContext.Provider
            value={{
                songs,
                currentSong,
                isPlaying,
                progress,
                duration,
                topTracks,
                playSong,
                togglePlay,
                nextSong,
                previousSong,
                updateProgress,
                updateDuration
            }}
        >
            {children}
        </SongContext.Provider>
    );
};