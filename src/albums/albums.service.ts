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
        return this.albumModel.find({user:userId}).sort({createdAt:-1}).lean()
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
