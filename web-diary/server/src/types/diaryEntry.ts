import mongoose, { Document, Types } from "mongoose";

interface FileType {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
}

export default interface DiaryEntryType extends Document {
    title: string;
    body: string;
    tags: string[];
    files: FileType[];
    user_id: Types.ObjectId
}
export type { FileType }