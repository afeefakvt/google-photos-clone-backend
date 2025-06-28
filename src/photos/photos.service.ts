import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from './cloudinary.service';
import { Photo, PhotoDocument } from './photo.schema/photo.schema';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File, userId: string) {
    const result = await this.cloudinary.uploadImage(file.buffer);
    const photo = new this.photoModel({
      url: result.url,
      public_id: result.public_id,
      user: userId,
      width: result.width,
      height: result.height,
      size: result.bytes,
    });
    return photo.save();
  }
  async getPhotosByUser(userId: string) {
    return this.photoModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(); //returns plain js objects
  }

  async getPhotoById(photoId: string, userId: string) {
    const photo = await this.photoModel.findById(photoId).lean();

    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.user !== userId) throw new ForbiddenException('Access denied');

    return {
      _id: photo._id,
      url: photo.url,
      public_id: photo.public_id,
      createdAt: photo.createdAt,
      metadata: {
        size: photo.size || 'Unknown',
        width: photo.width || 'Unknown',
        height: photo.height || 'Unknown',
      },
    };
  }
}
