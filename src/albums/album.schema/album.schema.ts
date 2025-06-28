import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AlbumDocument = Album & Document;

@Schema({timestamps:true})
export class Album {
    @Prop({required:true})
    title:string;

    @Prop()
    description:string

    @Prop({required:true})
    user:string;

    @Prop({type:[String],default:[] })
    photos:string[]

    @Prop() createdAt?: Date;
    @Prop() updatedAt?: Date;
}
export const AlbumSchema = SchemaFactory.createForClass(Album);
