require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index.hbs')
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results.hbs', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res, nex) => {
    const {artistId} = req.params;
    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
        console.log('searching for albums from artist', data.body.items );
        res.render("albums.hbs", {albums: data.body.items})
    })
})

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
        console.log('searching for tracks from album', data.body.items)
        res.render('tracks.hbs', {tracks: data.body.items})
    })
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
