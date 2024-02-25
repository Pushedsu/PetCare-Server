import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { UserSignupDto } from '../dto/user.signup.dto';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws/aws.service';
import { AuthLoginDto } from 'src/auth/dto/auth.login.dto';
import { Types } from 'mongoose';
import { User } from '../user.schema';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';

// Given / When / Then BDD 스타일로 테스트 코드를 작성!

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let authService: AuthService;
  let awsService: AwsService;

  const mockUserService = {
    signUp: jest.fn(),
    deleteUser: jest.fn(),
    logout: jest.fn(),
    getUserAllData: jest.fn(),
    updateName: jest.fn(),
    updatePassword: jest.fn(),
    findPasswordById: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
    validateByRefreshToken: jest.fn(),
  };

  const mockAwsService = {
    uploadFileToS3: jest.fn(),
    getAwsS3FileUrl: jest.fn(),
    deleteS3Object: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    awsService = module.get<AwsService>(AwsService);
  });

  describe('getCurrentUser', () => {
    it('getCurrentUser reuturn값 검증', async () => {
      //given
      //when
      //then
    });
  });

  describe('deleteUser', () => {
    it('회원 탈퇴시 deleteUser 호출 검증', async () => {
      //given
      //when
      //then
    });
  });

  describe('signUp', () => {
    it('회원 가입시 signUp 호출 검증', async () => {
      //given
      const userSignupData: UserSignupDto = {
        email: 'email1234@email.com',
        name: 'minsu',
        password: 'qwer1234',
      };

      //when
      const signUpSpy = jest.spyOn(userService, 'signUp');
      await controller.signUp(userSignupData);

      //then
      expect(signUpSpy).toBeCalledWith(userSignupData);
    });
  });

  describe('login', () => {
    it('login 메서드 호출 검증', async () => {
      //given
      const authLoginData: AuthLoginDto = {
        email: 'email1234@email.com',
        password: 'qwer1234',
      };

      //when
      const loginSpy = jest.spyOn(authService, 'login');
      await controller.login(authLoginData);

      //then
      expect(loginSpy).toBeCalledWith(authLoginData);
    });

    it('login 메서드 return 값 검증', async () => {
      //given
      const authLoginData: AuthLoginDto = {
        email: 'email1234@email.com',
        password: 'qwer1234',
      };

      const returnValue = {
        access_token: 'eyJhbGciOiJIUzI1NiIs...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIs...',
      };

      //when
      jest.spyOn(authService, 'login').mockResolvedValue(returnValue);
      const result = await controller.login(authLoginData);
      //then
      expect(result).toBe(returnValue);
    });
  });

  describe('logout', () => {
    it('logout 메서드 호출 검증', async () => {
      //given
      const logoutData: Types.ObjectId = new Types.ObjectId();

      //when
      const logoutSpy = jest.spyOn(userService, 'logout');
      await controller.logout(logoutData);

      //then
      expect(logoutSpy).toBeCalledWith(logoutData);
    });
  });

  describe('getAllUser', () => {
    it('getAllUser reuturn값 검증', async () => {
      //given
      //when
      //then
    });
  });

  describe('issueByRefreshToken', () => {
    it('issueByRefreshToken reuturn값 검증', async () => {
      //given
      //when
      //then
    });
  });

  describe('updateByName', () => {
    it('updateByName 메서드 호출 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdateNameData: UserUpdateNameDto = {
        id: randomObjectId,
        name: 'tester',
      };
      //when
      const updateByNameSpy = jest.spyOn(userService, 'updateName');
      await controller.updateByName(userUpdateNameData);
      //then
      expect(updateByNameSpy).toBeCalledWith(userUpdateNameData);
    });
  });

  describe('updatePassword', () => {
    it('updatePassword 메서드 호출 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userUpdatePasswordData: UserUpdatePasswordDto = {
        id: randomObjectId,
        currentPassword: 'crpw1234',
        password: 'pw1234',
      };
      //when
      const updatePasswordSpy = jest.spyOn(userService, 'updatePassword');
      await controller.updatePassword(userUpdatePasswordData);
      //then
      expect(updatePasswordSpy).toBeCalledWith(userUpdatePasswordData);
    });
  });

  describe('uploadImg', () => {
    it('uploadImg reuturn값 검증', async () => {
      //given
      //when
      //then
    });
  });

  describe('deleteImg', () => {
    it('deleteImg 메서드 호출 검증', async () => {
      //given
      const deletImgKeyData = 'images/example.jpg';
      //when
      const deleteImgSpy = jest.spyOn(awsService, 'deleteS3Object');
      await controller.deleteImg(deletImgKeyData);
      //then
      expect(deleteImgSpy).toBeCalledWith(deletImgKeyData);
    });
  });

  describe('findPasswordById', () => {
    it('findPasswordById 메서드 호출 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const findPasswordByIdData: UserFindPasswordDto = {
        id: randomObjectId,
        email: 'example12@email.com',
      };
      //when
      const findPasswordByIdSpy = jest.spyOn(userService, 'findPasswordById');
      await controller.findPasswordById(findPasswordByIdData);
      //then
      expect(findPasswordByIdSpy).toBeCalledWith(findPasswordByIdData);
    });

    it('findPassword 메서드 리턴 값 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const userFindPasswordByIdData: UserFindPasswordDto = {
        id: randomObjectId,
        email: 'example12@email.com',
      };
      //when
      //then
    });
  });
});
