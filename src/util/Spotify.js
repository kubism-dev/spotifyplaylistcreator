const clientID = 'bb3d86212b44485584ae84afeb9e0ab9';
const redirectURI = 'http://localhost:3000';
let token;

const Spotify = {
    getAccessToken() {
        if (token) {
            return token;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            token = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return token;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }

    },
    async search(term) {
        const token = Spotify.getAccessToken();
        const result = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term.target.value)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await result.json();
        const tracksArr = [];
        data.tracks.items.map(track => {
            tracksArr.push({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            });
        });
        return tracksArr;
    },
    async savePlaylist(playlistName, playlistURIs) {
        if (playlistName && playlistURIs) { 
            const token = Spotify.getAccessToken();
            const getID = await fetch(`https://api.spotify.com/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const resultID = await getID.json();
            let userID = resultID.id;

            const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    "name": playlistName,
                    "description": "New playlist description",
                    "public": true,
                })
            });
            const playlistID = await createPlaylist.json();

            const addToPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistID.id}/tracks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    "uris": playlistURIs
                })
            });
        } else {
            return;
        }

    }
}

export default Spotify;