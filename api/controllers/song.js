    'use strict'
    var Artist = require('../models/artist');
    var Album = require('../models/album');
    var Song = require('../models/song');
    var mongoosePaginate = require('mongoose-pagination');
    var fs = require('fs');
    var path = require('path');

    function getSongs(req, res){

        var albumId = req.params.Album;

        if(!albumId){
            var find = Song.find({}).sort('number');
        }else{
            var find = Song.find({album: albumId}).sort('number');
        }

            find.populate({
            path: 'album',
            populate:{
                path:'artist',
                model:'Artist'
                }
                }).exec(function(err, songs){
                            if(err){
                                res.status(500).send({message: 'error en la peticion'});
                            }else{
                                if(!songs){
                                    res.status(404).send({message: 'No hay canciones'});
                                }else{
                                    res.status(200).send({songs});

                                }
                            }
                        });
    }

    function getSong(req, res){
        var songId = req.params.id;
        Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
            if(err){
                res.status(500).send({message: 'error en la peticion'});
            }else{
                if(!song){
                    res.status(404).send({message: 'la cancion no existe'});
                }else{
                    res.status(200).send({song});
                }
            }
        });
        
        

    }

    function saveSong(req, res) {
        var song = new Song();
        var params = req.body;
        song.number = params.number;
        song.name = params.name;
        song.duration = params.duration;
        song.file = null;
        song.album = params.album;
        song.save((err, songStored) => {
            if (err) {
                res.status(500).send({ message: "Error al guardar la canción." });
            } else {
                if (!songStored) {
                    res.status(404).send({ message: "No se pudo almacenar la canción." });
                } else {
                    res.status(200).send({ song: songStored });
                }
            }
        });
    }


    function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;
    
        Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
           if(err){
               res.status(500).send({message:'error al actualizar el album'});
           }else{
               if(!songUpdated){
                   res.status(404).send({message:'no se ha podido actualizar el album'})
               }else{
                   res.status(200).send({song: songUpdated});
               }
           }
       })
   }

   function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message:'error al emiminar la cancion'});
            }else{
            if(!songRemoved){
                res.status(404).send({message:'no se ha podido eliminar la cancion'});
                }else{
                    res.status(200).send({songRemoved})
                }
            } 
        });
    }
    
    function uploadFile(req, res){
        var songId = req.params.id;
        var fileName = 'no subido...';
        if(req.files){
            var file_path = req.files.file.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];
    
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];
            if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'flac'){
                Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                    if(!songUpdated){
                        res.status(404).send({message:'no se ha podido actualizar el album'})
                    }else{
                        res.status(200).send({ song: songUpdated});
                    }
                });
            }else{
                res.status(200).send({message:'La extencion de la cancion debe ser ogg o mp3'})
            }
            console.log(file_path);
        }else{
            res.status(200).send({message:'no se ha subido el fichero de audio'});
        }
    }
    
    function getSongFile(req, res){
        var songFile = req.params.songFile;
        var path_file = './uploads/songs/' + songFile;
        fs.exists(path_file, function(exists){
            if(exists){
                res.sendFile(path.resolve(path_file));
            }else{
                res.status(200).send({message:'no existe la cancion'});
            }
        });
    }

    module.exports = {
        getSongFile,
        saveSong,
        updateSong,
        deleteSong,
        getSongs,
        uploadFile,
        getSong
    }
