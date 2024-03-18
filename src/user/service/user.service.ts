import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSignupDto } from '../dto/user.signup.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { Types } from 'mongoose';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { EmailService } from '../../email/email.service';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async updateName(body: UserUpdateNameDto) {
    const { id, name } = body;
    const updateName = await this.userRepository.updateName(id, name);
    return updateName;
  }

  async updatePassword(body: UserUpdatePasswordDto) {
    const { id, password, currentPassword } = body;

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다');
    }

    const checkPassword: boolean = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    return await this.userRepository.updatePassword(id, password);
  }

  async logout(id: Types.ObjectId) {
    const result = await this.userRepository.deleteRefreshToken(id);
    return result;
  }

  async deleteUser(id: Types.ObjectId, body: UserAccountDeleteDto) {
    const { password } = body;

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('Object_id가 존재하지 않습니다');
    }

    const checkPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }

    return await this.userRepository.findUserByIdAndDelete(user.id);
  }

  async signUp(body: UserSignupDto) {
    const { email, name, password } = body;

    const refreshToken = null;

    const image = '';

    const isEmailExists = await this.userRepository.ExistsByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isEmailExists) {
      throw new UnauthorizedException('입력한 이메일이 존재합니다. ');
    }

    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      refreshToken,
      image,
    });

    return user.readOnlyData;
  }

  async updateImgUrl(id: Types.ObjectId, url: string) {
    return await this.userRepository.updateImgUrl(id, url);
  }

  async findPasswordById(body: UserFindPasswordDto) {
    const { email, id } = body;
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다');
    }

    const checkEmail: boolean = email == user.email;

    if (!checkEmail) {
      throw new UnauthorizedException('이메일이 일치하지 않습니다');
    }

    //nodeEmailer나 aws email기능을 통해 입력받은 이메일에 임시 비밀번호를 전송하는 로직 구성

    const charset =
      process.env.CHARSET ||
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tempPassword = '';

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      tempPassword += charset[randomIndex];
    }

    await this.emailService.sendEmail(email, tempPassword);

    return await this.userRepository.updatePassword(id, tempPassword);
  }
}
