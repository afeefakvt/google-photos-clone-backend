import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { CloudinaryService } from './cloudinary.service';
import { Photo,PhotoSchema } from './photo.schema/photo.schema';


@Module({
  imports:[
    MongooseModule.forFeature([{name:Photo.name,schema:PhotoSchema}]),
    ConfigModule
  ],
  controllers: [PhotosController],
  providers: [PhotosService,CloudinaryService]
})
export class PhotosModule {}
