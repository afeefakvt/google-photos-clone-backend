import { Controller,Post,Get,UseInterceptors,UploadedFile,UseGuards,Req, Param} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService:PhotosService){}

    @UseGuards(JwtAuthGuard) //only logged in users can upload
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))  //use multer to intercept 'file' field

    async uploadImage(@UploadedFile() file:Express.Multer.File, @Req() req:any){
        return this.photosService.uploadImage(file,req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserPhotos(@Req() req:any){
        const userId = req.user.userId;
        return this.photosService.getPhotosByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':photoId')
    async getSinglePhoto(@Param('photoId') photoId:string, @Req() req:any){
        return this.photosService.getPhotoById(photoId,req.user.userId);
    }
}
