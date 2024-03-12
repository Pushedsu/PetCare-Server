import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { EmailService } from 'src/email/email.service';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { Types } from 'mongoose';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { User } from '../user.schema';

const mockRepository = () => {
  findAll: jest.fn();
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

describe('UserService', () => {
  //let service: UserService;
  let emailService: EmailService;
  let userRepository: UserRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: EmailService, useValue: mockEmailService },
        { provide: UserRepository, useValue: mockRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('updateName', () => {
    it('updateName 반환 값 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdateData: UserUpdateNameDto = {
        id: randomObjectId,
        name: 'tester',
      };
      const returnValue = {
        matchedCount: 1,
        modifiedCount: 1,
        acknowledged: true,
        upsertedCount: 0, // upsert가 발생하지 않았다면 0을 할당
        upsertedId: null, // upsert가 발생하지 않았다면 null을 할당
      };

      //when
      jest.spyOn(userRepository, 'updateName').mockResolvedValue(returnValue);
      const result = await userService.updateName(userUpdateData);
      //then
      expect(result).toEqual(returnValue);
    });
  });
  describe('updatePassword', () => {
    it('updatePassword 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdatePasswordData: UserUpdatePasswordDto = {
        id: randomObjectId,
        currentPassword: 'pw1234',
        password: 'pw1234',
      };
      const findUserByIdReturnValue: User = {};
      const updatePasswordReturnValue = {};
      const returnValue = {};

      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue);
      jest
        .spyOn(userRepository, 'updatePassword')
        .mockResolvedValue(updatePasswordReturnValue);
      const result = await userService.updatePassword(userUpdatePasswordData);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('updatePassword', () => {
    it('updatePassword 이메일이 존재하지 않는 경우 검증 ', async () => {
      //given
      const userUpdatePasswordData: UserUpdatePasswordDto = {};
      const findUserByIdReturnValue: User = {};
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue);
      const result = await userService.updatePassword(userUpdatePasswordData);
      //then
      await expect(result).rejects.toThrowError(
        new UnauthorizedException('이메일이 존재하지 않습니다'),
      );
    });
  });

  describe('updatePassword', () => {
    it('updatePassword 비밀번호가 일치하지 않는 경우 검증 ', async () => {
      //given
      const userUpdatePasswordData: UserUpdatePasswordDto = {};
      const findUserByIdReturnValue: User = {};
      //when
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(undefined);
      const result = await userService.updatePassword(userUpdatePasswordData);
      //then
      await expect(result).rejects.toThrowError(
        new UnauthorizedException('비밀번호가 일치하지 않습니다'),
      );
    });
  });

  describe('logout', () => {
    it('logout 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const returnValue = {};
      //when
      jest.spyOn(userRepository, 'logout').mockResolvedValue(returnValue);
      const result = await userService.logout(randomObjectId);
      //then
      expect(returnValue).toEqual(result);
    });
  });

  describe('deleteUser', () => {
    it('deleteUser 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {};
      const randomObjectId = new Types.ObjectId();
      const findUserByIdReturnValue = {};
      const returnValue = {};
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue);
      jest
        .spyOn(userRepository, 'findUserByIdAndDelete')
        .mockResolvedValue(findUserByIdAndDelete);
      const result = await userService.deleteUser(
        randomObjectId,
        userUpdatePasswordData,
      );
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('deleteUser', () => {
    it('deleteUser 이메일이 존재하지 않는 경우 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {};
      const randomObjectId = new Types.ObjectId();
      const findUserByIdReturnValue = {};
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue);
      const result = await userService.deleteUser(
        randomObjectId,
        userAccountDeleteData,
      );
      //then
      await expect(result).rejects.toThrowError(
        new UnauthorizedException('Object_id가 존재하지 않습니다'),
      );
    });
  });

  describe('deleteUser', () => {
    it('deleteUser 비밀번호가 일치하지 않는 경우 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {};
      const randomObjectId = new Types.ObjectId();
      const findUserByIdReturnValue = {};
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue);
      const result = await userService.deleteUser(
        randomObjectId,
        userAccountDeleteData,
      );
      //then
      await expect(result).rejects.toThrowError(
        new UnauthorizedException('비밀번호가 일치하지 않습니다'),
      );
    });
  });

  describe('signUp', () => {
    it('signUp 입력한 이메일 존재하지 않는 경우 검증 ', async () => {
      //given
      const userSignupData: UserSignupDto = {};
      const findUserByIdReturnValue = {};
      //when
      jest.spyOn(userRepository, 'ExistsByEmail').mockResolvedValue(false);
      const result = await userService.signUp(userSignupData);
      //then
      await expect(result).rejects.toThrowError(
        new UnauthorizedException('입력한 이메일이 존재합니다. '),
      );
    });
  });

  describe('signUp', () => {
    it('signUp 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const userSignupData: UserSignupDto = {};
      const findUserByIdReturnValue = {};
      const user: User = {};
      //when
      jest.spyOn(userRepository, 'ExistsByEmail').mockResolvedValue(true);
      jest.spyOn(userRepository, 'create').mockResolvedValue(user);
      const result = await userService.signUp(userSignupData);
      //then
      expect(result).toEqual(user.readOnlyData);
    });
  });

  describe('updateImgUrl', () => {
    it('updateImgUrl 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const url: string = {};
      const randomObjectId = new Types.ObjectId();
      const returnValue = {};
      //when
      jest.spyOn(userRepository, 'updateImgUrl').mockResolvedValue(returnValue);
      const result = await userService.updateImgUrl(randomObjectId, url);
      //then
      expect(result).toEqual(returnValue);
    });
  });

  describe('findPasswordById', () => {
    it('findPasswordById 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const userFindPasswordData: UserFindPasswordDto = {};
      const findUserByIdReturnValue = {};
      const user: User = {};
      let tempPassword = '';
      const returnValue = {};

      //when
      const result = await userService.findPasswordById(userFindPasswordData);
      const emailServiceSpy = jest.spyOn(emailService, 'sendEmail');
      jest
        .spyOn(userRepository, 'updatePassword')
        .mockResolvedValue(returnValue);
      //then
      expect(result).toEqual(returnValue);
      expect(emailServiceSpy).toBeCalledWith(tempPassword, user.email);
    });
  });
});
