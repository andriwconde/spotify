'use strict'
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


function getAlbums(req, res){
    if(req.params.page){
        var page =req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerpage = 3;

    Album.find().sort('year').paginate(page, itemsPerpage, function(err, albums, total){
        if(err){
            res.status(500).send({message:'error en la peticion'});
        }else{
            if(!albums){
                res.status(400).send({ message:'no se encontraron albums'});
            }else{
                res.status(200).send({
                    pages: total,
                    albums: albums
                });
            }
        }
    })
}
function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    console.log(params);
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err,albumStored) => {
       if(err){
           res.status(500).send({message:'Error al guardar el album'});
       }else{
           if(!albumStored){
            res.status(404).send({message:'no se ha registrado el album'});
           }else{
            res.status(200).send({album :albumStored });
           }
       }
    });
}

function getAlbum(req, res){
 var albumId = req.params.id;

    Album.findById(albumId, (err, album) =>{
        if(err){
            res.status(500).send({message:'error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message:'el album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function updateAlbum(req, res){
 var albumId = req.params.id;
 var update = req.body;
 
 Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message:'error al actualizar el album'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message:'no se ha podido actualizar el album'})
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    })
}

    function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message:'error al eliminar el album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message:'no se ha podido eliminar el album'});
            }else{
                Song.find({album: albumRemoved._id}).remove((err,songRemoved) => {
                    if(err){
                        res.status(500).send({message:'error al emiminar la cancion'});
                       }else{
                        if(!songRemoved){
                            res.status(404).send({message:'no se ha podido eliminar la cancion'});
                            }else{
                                res.status(200).send({albumRemoved})
                            }
                        } 
                    });
                }
            }
        });      
    }
function uploadImage(req, res){
    var albumId = req.params.id;
    var fileName = 'no subido...';
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(!albumUpdated){
                    res.status(404).send({message:'no se ha podido actualizar el album'})
                }else{
                    res.status(200).send({ album: albumUpdated});
                }
            });
        }else{
            res.status(200).send({message:'La imagen debe ser .png, .jpg o .gif'})
        }
        console.log(file_path);
    }else{
        res.status(200).send({message:'no se ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'no existe la imagen'});
        }
    });
}
module.exports = {
getAlbums,
saveAlbum,
getAlbum,
updateAlbum,
deleteAlbum,
uploadImage,
getImageFile
}