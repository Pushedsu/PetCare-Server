import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { UserSignupDto } from '../dto/user.signup.dto';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws/aws.service';
import { AuthLoginDto } from 'src/auth/dto/auth.login.dto';
import { Types } from 'mongoose';
import { Request } from 'express';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';
import { User } from '../user.schema';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

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

  jest.mock('../user.schema');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }) // JwtAuthGuard를 사용하는 대신, 모든 요청을 통과시키는 mock guard를 설정할 수 있습니다.
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    awsService = module.get<AwsService>(AwsService);
  });

  describe('getCurrentUser', () => {
    it('getCurrentUser reuturn값 검증', async () => {
      // readOnlyData 스키마에 맞춰 mockUser 객체를 구성
      const mockUser = {
        readOnlyData: {
          email: 'test@example.com',
          name: 'Test User',
          id: '1',
          image: 'image_url',
          posts: [], // posts 배열은 테스트의 목적에 따라 적절한 mock 데이터로 채울 수 있습니다.
        },
      };

      expect(controller.getCurrentUser(mockUser as any)).toEqual(
        mockUser.readOnlyData,
      );
    });
  });

  describe('deleteUser', () => {
    it('회원 탈퇴시 deleteUser 호출 검증', async () => {
      //given
      const userAccountDeleteData: UserAccountDeleteDto = {
        password: 'pw1234',
      };
      const randomObjectId = new Types.ObjectId();
      const mockUser: Partial<User> = {
        id: randomObjectId,
      };
      //when
      const deleteUserSpy = jest.spyOn(userService, 'deleteUser');
      await controller.deleteUser(mockUser as User, userAccountDeleteData);
      //then
      expect(deleteUserSpy).toBeCalledWith(mockUser.id, userAccountDeleteData);
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

  describe('issueByRefreshToken', () => {
    it('issueByRefreshToken reuturn값 검증', async () => {
      //given
      const randomObjectId = new Types.ObjectId();
      const token = { refresh_token: 'wer23w31r2...' };
      // user 객체에 refreshToken과 id 속성을 포함하는 mockRequest를 구현합니다.
      const mockRequest = {
        user: {
          refreshToken: token, // 실제 refreshToken 값
          id: randomObjectId, // 실제 사용자 ID
        },
      } as unknown as Request;
      const returnValue = { access_token: 'wer23w31r2...' };
      //when
      jest
        .spyOn(authService, 'validateByRefreshToken')
        .mockResolvedValue(returnValue);
      const result = await controller.issueByRefreshToken(mockRequest);
      //then
      expect(result).toEqual(returnValue);
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

  // describe('uploadImg', () => {
  //   it('uploadImg reuturn값 검증', async () => {
  //     //given
  //     const data = {
  //       key: 'someKey', // AWS S3에 저장될 파일의 키
  //       s3Object: Promise.resolve({}), // 이 부분은 실제 사용 사례에 따라 조정 필요
  //       contentType: 'image/jpeg', // 파일의 MIME 타입
  //     };

  //     const returnValue = {
  //       key: 'someKey',
  //       s3Object: {}, // 실제 AWS S3에서의 결과 객체 모방
  //       contentType: 'image/jpeg',
  //     };
  //     //when
  //     const uploadFileToS3Spy = jest
  //       .spyOn(awsService, 'uploadFileToS3')
  //       .mockResolvedValue(returnValue);
  //     const result = await controller.uploadImg();
  //     //then
  //     expect(uploadFileToS3Spy).toBeCalledWith(data);
  //     expect(result).toEqual(returnValue);
  //   });
  // });

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
      const returnValue = {
        matchedCount: 1,
        modifiedCount: 1,
        acknowledged: true,
        upsertedCount: 0, // upsert가 발생하지 않았다면 0을 할당
        upsertedId: null, // upsert가 발생하지 않았다면 null을 할당
      };

      //when
      jest
        .spyOn(userService, 'findPasswordById')
        .mockResolvedValue(returnValue);
      const result = await controller.findPasswordById(
        userFindPasswordByIdData,
      );
      //then
      expect(result).toEqual(returnValue);
    });
  });
});
