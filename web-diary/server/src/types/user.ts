import { Document, Types } from 'mongoose';

export default interface UserType extends Document {
  _id: Types.ObjectId | string
  username: string;
  email: string;
  password: string;
  activities: Activity[];
  googleId?: string;
}

export class Activity {
  name: string;
  userAgent: string;
  date: Date;

  constructor(name: string, userAgent: string | undefined) {
    this.name = name;
    this.date = new Date();
    this.userAgent = (userAgent) ? userAgent : '';
  }
}
