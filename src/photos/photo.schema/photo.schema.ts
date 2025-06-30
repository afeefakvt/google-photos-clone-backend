import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PhotoDocument = Photo & Document;

@Schema({timestamps:true})
export class Photo {
    @Prop({required:true})
    url:string;

    @Prop()
    public_id:string;

    @Prop({required:true})
    user:string;

    @Prop()
    width:number;

    @Prop()
    height:number;

    @Prop()
    size:number

    @Prop()
    format:string

    @Prop() createdAt?: Date;
    @Prop() updatedAt?: Date;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
