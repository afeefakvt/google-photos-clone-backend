import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './album.schema/album.schema';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from 'src/photos/photo.schema/photo.schema';

@Injectable()
export class AlbumsService {
    constructor(
        @InjectModel(Album.name) private albumModel:Model<AlbumDocument>,
        @InjectModel(Photo.name) private photoModel:Model<PhotoDocument>,
    ){}

    async createAlbum(title:string,description:string,userId:string){
        const newAlbum = new this.albumModel({title,description,user:userId})
        return newAlbum.save()
    }

    async addPhotoToAlbum(albumId:string,photoId:string,userId:string){
        const album = await this.albumModel.findById(albumId)
        if(!album) throw new NotFoundException("Album not found");
        if(album.user !== userId) throw new ForbiddenException("Not your album");

        const photo = await this.photoModel.findById(photoId);
        if(!photo) throw new NotFoundException("Photo not found");
        if(photo.user!== userId) throw new ForbiddenException("Not your photo");

        if(!album.photos.includes(photoId)){
            album.photos.push(photoId)
            await album.save()
        }
        return {message:"Photo added to album successfully",album}
    }

    async getAlbumsByUser(userId:string){
        const albums =  await this.albumModel.find({user:userId}).lean()

        const enhancedAlbums = await Promise.all(
            albums.map(async(album)=>{
                let coverUrl: string | null =null;

                if(album.photos.length > 0){
                    const firstPhoto = await this.photoModel.findById(album.photos[0]).lean();
                    if(firstPhoto){
                        coverUrl  = firstPhoto.url;
                    }
                }
                return{
                    ...album,
                    coverUrl
                }
            })
        )
        return enhancedAlbums

    }

    async getPhotosInAlbum(albumId:string,userId:string){
        const album = await this.albumModel.findById(albumId).lean();

        if(!album) throw new NotFoundException("Album not found");
        if(album.user !==userId) throw new ForbiddenException("Not your album");

        const photos= await this.photoModel
        .find({_id:{$in:album.photos},user:userId})
        .sort({createdAt:-1})
        .lean()

        return{
            album:{
                _id:album._id,
                title:album.title,
                description:album.description,
                createdAt:album.createdAt
            },
            photos,
        };
    }
}
