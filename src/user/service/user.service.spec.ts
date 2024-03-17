import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { EmailService } from 'src/email/email.service';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { ObjectId, Types } from 'mongoose';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { User } from '../user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { UserSignupDto } from '../dto/user.signup.dto';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';
import * as bcrypt from 'bcrypt';

const mockRepository = {
  findAll: jest.fn(),
  ExistsByEmail: jest.fn(),
  create: jest.fn(),
  findUserByEmail: jest.fn(),
  deleteRefreshToken: jest.fn(),
  findUserById: jest.fn(),
  findUserByIdAndDelete: jest.fn(),
  updateFieldById: jest.fn(),
  updateName: jest.fn(),
  updatePassword: jest.fn(),
  findUserByIdWithoutPassword: jest.fn(),
  updateImgUrl: jest.fn(),
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
        password: 'qwer1234',
      };
      const hashedPassword = await bcrypt.hash('pw1234', 10);
      const findUserByIdReturnValue = {
        email: 'test12@email.com',
        name: 'tester',
        password: hashedPassword,
        refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
        image: 'imageUrl',
      };
      const updatePasswordReturnValue = {
        matchedCount: 1, //쿼리가 일치하는 수
        modifiedCount: 1, //실제 업데이트 된 문서의 수
        acknowledged: true, //작업 성공 여부
        upsertedCount: 1, // upsert가 발생하지 않았다면 0을 할당
        upsertedId: randomObjectId, // upsert가 발생하지 않았다면 null을 할당
      };

      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue as User);
      jest
        .spyOn(userRepository, 'updatePassword')
        .mockResolvedValue(updatePasswordReturnValue);
      const result = await userService.updatePassword(userUpdatePasswordData);
      //then
      expect(result).toEqual(updatePasswordReturnValue);
    });

    it('updatePassword 이메일이 존재하지 않는 경우 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdatePasswordData: UserUpdatePasswordDto = {
        id: randomObjectId,
        currentPassword: 'pw1234',
        password: 'qwer1234',
      };

      //when
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      //then
      await expect(
        userService.updatePassword(userUpdatePasswordData),
      ).rejects.toThrowError(
        new UnauthorizedException('이메일이 존재하지 않습니다'),
      );
    });

    it('updatePassword 비밀번호가 일치하지 않는 경우 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdatePasswordData: UserUpdatePasswordDto = {
        id: randomObjectId,
        currentPassword: 'pw1234',
        password: 'qwer1234',
      };
      const findUserByIdReturnValue = {
        email: 'test12@email.com',
        name: 'tester',
        password: 'test1234',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue as User);
      //then
      await expect(
        userService.updatePassword(userUpdatePasswordData),
      ).rejects.toThrowError(
        new UnauthorizedException('비밀번호가 일치하지 않습니다'),
      );
    });
  });

  describe('logout', () => {
    it('logout 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const returnValue = {
        matchedCount: 1, //쿼리가 일치하는 수
        modifiedCount: 1, //실제 업데이트 된 문서의 수
        acknowledged: true, //작업 성공 여부
        upsertedCount: 1, // upsert가 발생하지 않았다면 0을 할당
        upsertedId: randomObjectId, // upsert가 발생하지 않았다면 null을 할당
      };
      //when
      jest
        .spyOn(userRepository, 'deleteRefreshToken')
        .mockResolvedValue(returnValue);
      const result = await userService.logout(randomObjectId);
      //then
      expect(returnValue).toEqual(result);
    });
  });

  describe('deleteUser', () => {
    it('deleteUser 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {
        password: 'test1234',
      };
      const randomObjectId = new Types.ObjectId();
      const hashedPassword = await bcrypt.hash('test1234', 10);
      const findUserByIdReturnValue = {
        email: 'test12@email.com',
        name: 'tester',
        password: hashedPassword,
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      const findUserByIdAndDeleteReturnValue = {
        _id: randomObjectId, // 명시적으로 _id 속성 추가
        email: 'test12@email.com',
        name: 'tester',
        password: 'test1234',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue as User);
      jest
        .spyOn(userRepository, 'findUserByIdAndDelete')
        .mockResolvedValue(
          findUserByIdAndDeleteReturnValue as User & { _id: Types.ObjectId },
        );
      const result = await userService.deleteUser(
        randomObjectId,
        userAccountDeleteData,
      );
      //then
      expect(result).toEqual(findUserByIdAndDeleteReturnValue);
    });

    it('deleteUser 이메일이 존재하지 않는 경우 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {
        password: 'pw1234',
      };
      const randomObjectId = new Types.ObjectId();
      //when
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      //then
      await expect(
        userService.deleteUser(randomObjectId, userAccountDeleteData),
      ).rejects.toThrowError(
        new UnauthorizedException('Object_id가 존재하지 않습니다'),
      );
    });

    it('deleteUser 비밀번호가 일치하지 않는 경우 검증 ', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {
        password: 'pw1234',
      };
      const randomObjectId = new Types.ObjectId();
      const findUserByIdReturnValue = {
        email: 'test12@email.com',
        name: 'tester',
        password: 'test1234',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue as User);

      //then
      await expect(
        userService.deleteUser(randomObjectId, userAccountDeleteData),
      ).rejects.toThrowError(
        new UnauthorizedException('비밀번호가 일치하지 않습니다'),
      );
    });
  });

  describe('signUp', () => {
    it('signUp 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userSignupData: UserSignupDto = {
        email: 'test12@email.com',
        name: 'tester',
        password: 'pw1234',
      };
      const returnValue: Partial<User> = {
        _id: randomObjectId, // 명시적으로 _id 속성 추가
        email: 'test12@email.com',
        name: 'tester',
        password: 'pw1234',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      //when
      jest.spyOn(userRepository, 'ExistsByEmail').mockResolvedValue(false);
      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(returnValue as User & { _id: ObjectId });
      const result = await userService.signUp(userSignupData);
      //then
      expect(result).toEqual(returnValue.readOnlyData);
    });
    it('signUp 입력한 이메일 존재하지 않는 경우 검증 ', async () => {
      //given
      const userSignupData: UserSignupDto = {
        email: 'test12@email.com',
        name: 'tester',
        password: 'pw1234',
      };
      //when
      jest.spyOn(userRepository, 'ExistsByEmail').mockResolvedValue(true);
      //then
      await expect(userService.signUp(userSignupData)).rejects.toThrowError(
        new UnauthorizedException('입력한 이메일이 존재합니다. '),
      );
    });
  });

  // describe('updateImgUrl', () => {
  //   it('updateImgUrl 반환 값 성공한 케이스 검증 ', async () => {
  //     //given
  //     const url: string = {};
  //     const randomObjectId = new Types.ObjectId();
  //     const returnValue = {};
  //     //when
  //     jest.spyOn(userRepository, 'updateImgUrl').mockResolvedValue(returnValue);
  //     const result = await userService.updateImgUrl(randomObjectId, url);
  //     //then
  //     expect(result).toEqual(returnValue);
  //   });
  // });

  describe('findPasswordById', () => {
    it('findPasswordById 반환 값 성공한 케이스 검증 ', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userFindPasswordData: UserFindPasswordDto = {
        id: randomObjectId,
        email: 'test12@email.com',
      };
      const findUserByIdReturnValue = {
        email: 'test12@email.com',
        name: 'tester',
        password: 'test1234',
        refreshToken: 'eyJhbGciOiJIUzI1NiIs',
        image: 'wjorie/aireo',
      };
      const updatePasswordReturnValue = {
        matchedCount: 1, //쿼리가 일치하는 수
        modifiedCount: 1, //실제 업데이트 된 문서의 수
        acknowledged: true, //작업 성공 여부
        upsertedCount: 1, // upsert가 발생하지 않았다면 0을 할당
        upsertedId: randomObjectId, // upsert가 발생하지 않았다면 null을 할당
      };
      const tempPassword = 'FFFFFFFFFFFF';
      //when
      jest
        .spyOn(userRepository, 'findUserById')
        .mockResolvedValue(findUserByIdReturnValue as User);
      const sendEmailSpy = jest.spyOn(emailService, 'sendEmail');
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      jest
        .spyOn(userRepository, 'updatePassword')
        .mockResolvedValue(updatePasswordReturnValue);
      const result = await userService.findPasswordById(userFindPasswordData);
      //then
      expect(result).toEqual(updatePasswordReturnValue);
      expect(sendEmailSpy).toBeCalledWith(
        userFindPasswordData.email,
        tempPassword,
      );
    });
  });
});
