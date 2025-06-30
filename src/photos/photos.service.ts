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
      format:result.format
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
        format:photo.format || "Unknown"
      },
    };
  }

  async searchPhotos(query:any,userId:string){
    const {
      minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    dateFrom,
    dateTo,
    search,
    } = query

    const filter: any = { user: userId };

    if (minWidth) filter.width = { ...filter.width, $gte: Number(minWidth) };
    if (maxWidth) filter.width = { ...filter.width, $lte: Number(maxWidth) };

  if (minHeight) filter.height = { ...filter.height, $gte: Number(minHeight) };
  if (maxHeight) filter.height = { ...filter.height, $lte: Number(maxHeight) };

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }
  if(search){
    filter.format  = {$regex:search, $options:'i'};
  }
    return this.photoModel.find(filter).sort({ createdAt: -1 }).lean();

  }
}
