import { Body, Controller, Param, Post, Req, UseGuards ,Get} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AlbumsService } from './albums.service';

@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumsController {
    constructor(private readonly albumsService:AlbumsService){}

    @Post('create')
    async createAlbum(@Body() body:{title:string, description?:string},@Req() req:any){
        return this.albumsService.createAlbum(body.title,body.description?? "",req.user.userId)
    }

    @Post(':albumId/addPhoto')
    async addPhototoAlbum(@Param('albumId') albumId:string, @Body('photoId') photoId:string, @Req() req:any ){
        return this.albumsService.addPhotoToAlbum(albumId,photoId,req.user.userId)
    }

    @Get()
    async getUserAlbums(@Req() req:any){
        return this.albumsService.getAlbumsByUser(req.user.userId)
    }

    @Get(':albumId/photos')
    async getPhotosInAlbum(@Param('albumId') albumId:string, @Req() req:any){
        return this.albumsService.getPhotosInAlbum(albumId,req.user.userId)
    }

}
