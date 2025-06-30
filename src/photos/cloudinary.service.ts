import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { error } from 'console';

@Injectable()
export class CloudinaryService{
    constructor(private configService:ConfigService){
        cloudinary.config({
            cloud_name:this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key:this.configService.get('CLOUDINARY_API_KEY'),
            api_secret:this.configService.get('CLOUDINARY_API_SECRET')
        });
    }

    async uploadImage(buffer:Buffer):Promise<{url:string; public_id:string,width:number,height:number,bytes:number,format:string}>{
        return new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'googleclone' },
                (error,result)=>{
                if(error) return reject(error);
                if (!result) return reject(new Error('Upload failed, result is undefined'));

                resolve({url:result.secure_url,public_id:result?.public_id,width:result.width,height:result.height,bytes:result.bytes,format:result.format})
            })
                Readable.from(buffer).pipe(uploadStream);

        })
    }
}