'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir:'./uploads/artists'});

api.get('/artist/:id',md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist',md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/artist/:id',md_auth.ensureAuth, ArtistController.updateArtist);
api.get('/artists/:page?',md_auth.ensureAuth, ArtistController.getArtists);
api.delete('/artist/:id',md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[ md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;
