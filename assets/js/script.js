document.addEventListener('DOMContentLoaded', function () {
    // Fetch data when the page loads
    fetchMusicData();

    // Handle search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            console.log(`Searching for: ${event.target.value}`);
            // Add your search logic here
        }
    });
});

async function fetchMusicData() {
    try {
        const response = await fetch('php/api.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched data:', data);
        displayMusicData(data);
    } catch (error) {
        console.error('Error fetching music data:', error);
        displayFallbackContent();
    }
}

function displayMusicData(data) {
    // Populate sections dynamically
    populateSection('latest-releases-content', data.albums?.items, createMusicCard);
    populateSection('artist-showcase', data.artists?.items, createArtistCard);
    populateSection('latest-english-content', data.english?.items, createMusicCard);
    populateSection('latest-hindi-content', data.hindi?.items, createMusicCard);
}

function populateSection(containerId, items, createCardFunction) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No content available.</p>';
        return;
    }
    items.forEach(item => container.appendChild(createCardFunction(item)));
}

function createMusicCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.images[0]?.url}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.release_date}</p>
    `;
    return card;
}

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
        <img src="${artist.images[0]?.url}" alt="${artist.name}">
        <h3>${artist.name}</h3>
    `;
    return card;
}

function displayFallbackContent() {
    document.querySelectorAll('.latest-release-content, .artist-showcase, .latest-english-content, .latest-hindi-content').forEach(container => {
        container.innerHTML = '<p>Unable to load content. Please try again later.</p>';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from the API when the page loads
    fetchMusicData();

    // Handle search input
    document.getElementById('search-input').addEventListener('keypress', handleSearch);
});

async function fetchMusicData() {
    try {
        const response = await fetch('php/api.php');
        const data = await response.json();
        displayMusicData(data);
    } catch (error) {
        console.error('Error fetching music data:', error);
    }
}

function displayMusicData(data) {
    const latestReleasesContainer = document.querySelector('.latest-release-content');
    latestReleasesContainer.innerHTML = '';

    data.albums.items.forEach(album => {
        const card = createMusicCard(album);
        latestReleasesContainer.appendChild(card);
    });

    const popularArtistsContainer = document.querySelector('.artist-showcase');
    popularArtistsContainer.innerHTML = '';

    data.artists.items.forEach(artist => {
        const artistCard = createArtistCard(artist);
        popularArtistsContainer.appendChild(artistCard);
    });

    const latestEnglishContainer = document.querySelector('.latest-english-content');
    latestEnglishContainer.innerHTML = '';

    data.english.items.forEach(track => {
        const englishCard = createMusicCard(track);
        latestEnglishContainer.appendChild(englishCard);
    });

    const latestHindiContainer = document.querySelector('.latest-hindi-content');
    latestHindiContainer.innerHTML = '';

    data.hindi.items.forEach(track => {
        const hindiCard = createMusicCard(track);
        latestHindiContainer.appendChild(hindiCard);
    });
}

function createMusicCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = item.images[0].url;
    img.alt = item.name;

    const playButton = document.createElement('a');
    playButton.href = `#play-bar${item.id}`;
    playButton.innerHTML = '<i class="fas fa-play"></i>';

    const songDescription = document.createElement('div');
    songDescription.classList.add('song-description');

    const songName = document.createElement('h3');
    songName.textContent = item.name;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = new Date(item.release_date).toLocaleString('default', { month: 'short', year: 'numeric' });

    songDescription.appendChild(songName);
    songDescription.appendChild(releaseDate);

    const options = document.createElement('div');
    options.classList.add('options');

    const duration = document.createElement('p');
    duration.classList.add('time');
    duration.textContent = item.duration_ms ? millisToMinutesAndSeconds(item.duration_ms) : 'N/A';

    options.appendChild(duration);

    card.appendChild(img);
    card.appendChild(playButton);
    card.appendChild(songDescription);
    card.appendChild(options);

    return card;
}

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.classList.add('artist-card');

    const img = document.createElement('img');
    img.src = artist.images[0].url;
    img.alt = artist.name;

    const artistName = document.createElement('h3');
    artistName.textContent = artist.name;

    const artistDescription = document.createElement('div');
    artistDescription.classList.add('artist-description');

    artistDescription.appendChild(artistName);

    card.appendChild(img);
    card.appendChild(artistDescription);

    return card;
}

function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        try {
            const response = await fetch(`https://spotify23.p.rapidapi.com/search/?type=multi&q=${query}&offset=0&limit=10&numberOfTopResults=5`, {
                headers: {
                    'x-rapidapi-host': 'spotify23.p.rapidapi.com',
                    'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
                }
            });
            const data = await response.json();
            displayMusicData(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
}

// Fetch Album Details
async function fetchAlbumDetails(albumId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Album Tracks
async function fetchAlbumTracks(albumId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/album_tracks/?id=${albumId}&offset=0&limit=300`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Album Metadata
async function fetchAlbumMetadata(albumId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/album_metadata/?id=${albumId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Details
async function fetchArtistDetails(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artists/?ids=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Overview
async function fetchArtistOverview(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_overview/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Discography Overview
async function fetchArtistDiscographyOverview(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_discography_overview/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Albums
async function fetchArtistAlbums(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_albums/?id=${artistId}&offset=0&limit=100`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Singles
async function fetchArtistSingles(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_singles/?id=${artistId}&offset=0&limit=20`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Appears On
async function fetchArtistAppearsOn(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_appears_on/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Discovered On
async function fetchArtistDiscoveredOn(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_discovered_on/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Featuring
async function fetchArtistFeaturing(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_featuring/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Artist Related
async function fetchArtistRelated(artistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/artist_related/?id=${artistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Track Details
async function fetchTrackDetails(trackIds) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/tracks/?ids=${trackIds}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Track Credits
async function fetchTrackCredits(trackId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/track_credits/?id=${trackId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Track Lyrics
async function fetchTrackLyrics(trackId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/track_lyrics/?id=${trackId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Track Recommendations
async function fetchTrackRecommendations(seedTracks, seedArtists, seedGenres, limit = 20) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/recommendations/?limit=${limit}&seed_tracks=${seedTracks}&seed_artists=${seedArtists}&seed_genres=${seedGenres}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Playlist Details
async function fetchPlaylistDetails(playlistId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/playlist/?id=${playlistId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Playlist Tracks
async function fetchPlaylistTracks(playlistId, offset = 0, limit = 100) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/playlist_tracks/?id=${playlistId}&offset=${offset}&limit=${limit}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Genre View
async function fetchGenreView(genreId, contentLimit = 10, limit = 20) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/genre_view/?id=${genreId}&content_limit=${contentLimit}&limit=${limit}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Podcast Episodes
async function fetchPodcastEpisodes(podcastId, offset = 0, limit = 50) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/podcast_episodes/?id=${podcastId}&offset=${offset}&limit=${limit}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Episode Details
async function fetchEpisodeDetails(episodeId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/episode/?id=${episodeId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Episode Sound
async function fetchEpisodeSound(episodeId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/episode_sound/?id=${episodeId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch User Profile
async function fetchUserProfile(userId, playlistLimit = 10, artistLimit = 10) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/user_profile/?id=${userId}&playlistLimit=${playlistLimit}&artistLimit=${artistLimit}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch User Followers
async function fetchUserFollowers(userId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/user_followers/?id=${userId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Radio Playlist
async function fetchRadioPlaylist(uri) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/seed_to_playlist/?uri=${encodeURIComponent(uri)}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Concerts
async function fetchConcerts(countryCode = 'US') {
    const response = await fetch(`https://spotify23.p.rapidapi.com/concerts/?gl=${countryCode}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Fetch Concert Details
async function fetchConcertDetails(concertId) {
    const response = await fetch(`https://spotify23.p.rapidapi.com/concert/?id=${concertId}`, {
        headers: {
            'x-rapidapi-host': 'spotify23.p.rapidapi.com',
            'x-rapidapi-key': '0dbcdc59famsh2c9ce9d2398ac12p19525djsnf43663097516'
        }
    });
    const data = await response.json();
    return data;
}

// Example usage
const albumId = '3IBcauSj5M2A6lTeffJzdv';
const artistId = '2w9zwq3AktTeYYMuhMjju8';
const trackIds = '4WNcduiCmDNfmTEz7JvmLv';
const trackId = '1brwdYwjltrJo7WHpIvbYt';
const seedTracks = '0c6xIDDpzE81m2q797ordA';
const seedArtists = '4NHQUGzhtTLFvgF5SZesLK';
const seedGenres = 'classical%2Ccountry';
const playlistId = '37i9dQZF1DX4Wsb4d7NKfP';
const genreId = '0JQ5DAqbMKFEC4WFtoNRpw';
const podcastId = '0ofXAdFIQQRsCYj9754UFx';
const episodeId = '55EWbmkVr8iDNmSyperh9o';
const userId = 'nocopyrightsounds';
const uri = 'spotify:artist:2w9zwq3AktTeYYMuhMjju8';
const concertId = '6PodeS6Nvq7AwacfxsxHKT';

fetchAlbumDetails(albumId).then(data => console.log(data));
fetchAlbumTracks(albumId).then(data => console.log(data));
fetchAlbumMetadata(albumId).then(data => console.log(data));
fetchArtistDetails(artistId).then(data => console.log(data));
fetchArtistOverview(artistId).then(data => console.log(data));
fetchArtistDiscographyOverview(artistId).then(data => console.log(data));
fetchArtistAlbums(artistId).then(data => console.log(data));
fetchArtistSingles(artistId).then(data => console.log(data));
fetchArtistAppearsOn(artistId).then(data => console.log(data));
fetchArtistDiscoveredOn(artistId).then(data => console.log(data));
fetchArtistFeaturing(artistId).then(data => console.log(data));
fetchArtistRelated(artistId).then(data => console.log(data));
fetchTrackDetails(trackIds).then(data => console.log(data));
fetchTrackCredits(trackId).then(data => console.log(data));
fetchTrackLyrics(trackId).then(data => console.log(data));
fetchTrackRecommendations(seedTracks, seedArtists, seedGenres).then(data => console.log(data));
fetchPlaylistDetails(playlistId).then(data => console.log(data));
fetchPlaylistTracks(playlistId).then(data => console.log(data));
fetchGenreView(genreId).then(data => console.log(data));
fetchPodcastEpisodes(podcastId).then(data => console.log(data));
fetchEpisodeDetails(episodeId).then(data => console.log(data));
fetchEpisodeSound(episodeId).then(data => console.log(data));
fetchUserProfile(userId).then(data => console.log(data));
fetchUserFollowers(userId).then(data => console.log(data));
fetchRadioPlaylist(uri).then(data => console.log(data));
fetchConcerts().then(data => console.log(data));
fetchConcertDetails(concertId).then(data => console.log(data));
