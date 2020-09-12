'use strict'
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({ message:'error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({ message:'el artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });

}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerpage = 3;

    Artist.find().sort('name').paginate(page, itemsPerpage, function(err, artists, total){
        if(err){
            res.status(500).send({ message:'error en la peticion'});
        }else{
            if(!artists){
                res.status(400).send({ message:'no se encontraron artistas'});

            }else{
                res.status(200).send({ 
                    pages: total,
                    artists: artists
                });

            }
        }
    })
}

function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;
    console.log(params);
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    
                artist.save((err,artistStored) => {
                    if(err){
                        res.status(200).send({ message:'Error al guardar el artista'});
                    }else{
                        if(!artistStored){
                            res.status(404).send({ message:'No se ha registrado el artista'});
                        }else{
                            res.status(200).send({artist :artistStored });
                            
                        }

                    }
                });
            
        
}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({ message:'Error al actualizar el artista'})
        }else{
            if(!artistUpdated){
                res.status(404).send({ message:'no se ha podido actualizar el artista'})
            }else{
                res.status(200).send({ artist: artistUpdated});
            }
        }
    });
    }
function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({ message:'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({ message:'no se ha podido eliminar el artista'});
            }else{
               
                Album.find({artist: artistRemoved._id}).remove((err,albumRemoved) =>{
                    if(err){
                        res.status(500).send({ message:'Error al eliminar el album'})
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({ message:'no se ha podido eliminar el album'})
                        }else{
                            Song.find({artist: artistRemoved._id}).remove((err,songRemoved) => {
                                if(err){
                                    res.status(500).send({ message:'Error al eliminar la cancion'})
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({ message:'no se ha podido eliminar la cancion'})
                                    }else{
                                        res.status(200).send({artistRemoved})
                                   }  
                                }
                            });    
                        }
                    }    
                });
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var fileName = 'no subido...';
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if(!artistUpdated){
                    res.status(404).send({ message:'no se ha podido actualizar el artista'})
                }else{
                    res.status(200).send({ artist: artistUpdated});
                }
            });
        }else{
            res.status(200).send({ message:'La imagen debe ser .png, .jpg o .gif'})
        }

        console.log(file_path);
    }else{
        res.status(200).send({ message:'no se ha subido ninguna imagen'})
    }
}
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/'+ imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({ message:'no existe la imagen'});
        }
    });
}

module.exports ={
    saveArtist,
    getArtist,
    updateArtist,
    getArtists,
    deleteArtist,
    uploadImage,
    getImageFile
};