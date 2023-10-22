import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { HydratedDocument, ObjectId, SchemaTypes, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true, type: String})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({type: Date})
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({email: 1}, {unique: true})

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};