const BASE_URL = "https://cms.samespace.com";

export const fetchSongs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/items/songs`);
        const data = await response.json()
        console.log("API response",data);
        
        return data.data;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return []
    }
}

export const getCoverUrl = (coverId) => {
    return `${BASE_URL}/assets/${coverId}`
}