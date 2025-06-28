import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './album.schema/album.schema';
import { Photo, PhotoSchema } from 'src/photos/photo.schema/photo.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Album.name,schema:AlbumSchema},
      {name:Photo.name,schema:PhotoSchema}
    ])
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService]
})
export class AlbumsModule {}
