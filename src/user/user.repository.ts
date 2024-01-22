import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Posts } from '../posts/posts.schema';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
  ) {}

  async ExistsByEmail(email: string) {
    const exists = await this.userModel.exists({ email });
    return exists ? true : false;
  }

  async findAll() {
    const allUserData = await this.userModel
      .find()
      .populate({ path: 'posts', model: this.postsModel });
    return allUserData;
  }

  async create(user: UserCreateDto) {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async deleteRefreshToken(id: Types.ObjectId) {
    const user = await this.userModel.updateOne(
      { _id: id },
      { $set: { refreshToken: null } },
    );
    return user;
  }

  async findUserById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async findUserByIdAndDelete(id: Types.ObjectId) {
    const user = await this.userModel.findByIdAndDelete(id);
    await this.postsModel.findOneAndDelete({ author: id });
    return user;
  }

  async updateFieldById(id: Types.ObjectId, token: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $set: { refreshToken: token } },
    );
  }

  async updateName(id: Types.ObjectId, rename: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $set: { name: rename } },
    );
  }

  async updatePassword(id: Types.ObjectId, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userModel.updateOne(
      { _id: id },
      { $set: { password: hashedPassword } },
    );
  }

  async findUserByIdWithoutPassword(
    userId: Types.ObjectId,
  ): Promise<User | null> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshToken');
    return user;
  }

  async updateImgUrl(id: Types.ObjectId, img: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $set: { image: img } },
    );
  }
}
