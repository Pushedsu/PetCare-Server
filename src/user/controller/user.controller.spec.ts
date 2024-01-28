import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { UserSignupDto } from '../dto/user.signup.dto';
import { UserAccountDeleteDto } from '../dto/user.accountDelete.dto';
import { AuthLoginDto } from 'src/auth/dto/auth.login.dto';
import { User } from '../user.schema';
import { Types } from 'mongoose';
import { UserUpdateNameDto } from '../dto/user.updateName.dto';
import { UserUpdatePasswordDto } from '../dto/user.updatePassword.dto';
import { UserFindPasswordDto } from '../dto/user.findPassword.dto';

// Given / When / Then BDD 스타일로 테스트 코드를 작성!

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('accountDelete', () => {
    it('회원 탈퇴', async () => {
      //given
      const user = new User(); //유저 스키마 객체 생성
      user.id = new Types.ObjectId(); //_id 가짜 객체 값을 대입
      const userAccountDeleteDto: UserAccountDeleteDto = {
        password: 'qwer1234',
      };
      //when
      const accountDeleteSpy = jest.spyOn(service, 'deleteUser');
      await controller.deleteUser(user.id, userAccountDeleteDto);
      //then
      expect(accountDeleteSpy).toBeCalledWith(userAccountDeleteDto);
    });
  });

  describe('signUp', () => {
    it('회원 가입', async () => {
      //given
      const userSignupDto: UserSignupDto = {
        email: 'email1234@email.com',
        name: 'minsu',
        password: 'qwer1234',
      };

      //when
      const signUpSpy = jest.spyOn(service, 'signUp');
      await controller.signUp(userSignupDto);

      //then
      expect(signUpSpy).toBeCalledWith(userSignupDto);
    });
  });

  describe('login', () => {
    it('로그인', async () => {
      //auth service 부문에서 사용된 곳도 있으므로 코드 추가 보류
      //given
      const authLoginDto: AuthLoginDto = {
        email: 'email1234@email.com',
        password: 'qwer1234',
      };
      //when
      await controller.login(authLoginDto);
      //then
    });
  });

  describe('logout', () => {
    it('로그아웃', async () => {
      //given
      const objectId = new Types.ObjectId();
      //when
      const logoutSpy = jest.spyOn(service, 'logout');
      await controller.logout(objectId);
      //then
      expect(logoutSpy).toBeCalledWith(objectId);
    });
  });

  describe('getAccessToken', () => {
    it('로그인 유지', async () => {
      //auth service 부문에서 사용된 곳도 있으므로 코드 추가 보류
      //given
      //when
      //then
    });
  });

  describe('updateName', () => {
    it('이름 변경', async () => {
      //given
      const userUpadateNameDto: UserUpdateNameDto = {
        name: 'minsu',
        id: new Types.ObjectId(),
      };
      //when
      const updateNameSpy = jest.spyOn(service, 'updateName');
      await controller.updateByName(userUpadateNameDto);
      //then
      expect(updateNameSpy).toBeCalledWith(userUpadateNameDto);
    });
  });

  describe('updatePassword', () => {
    it('비밀번호 변경', async () => {
      //given
      const userUpadatePasswordDto: UserUpdatePasswordDto = {
        id: new Types.ObjectId(),
        password: 'qwer1234',
        currentPassword: 'asdf5678',
      };
      //when
      const userUpadatePasswordSpy = jest.spyOn(service, 'updatePassword');
      await controller.updatePassword(userUpadatePasswordDto);
      //then
      expect(userUpadatePasswordSpy).toBeCalledWith(userUpadatePasswordDto);
    });
  });

  describe('uploadImg', () => {
    it('이미지 업로드', async () => {
      //given
      //when
      //then
    });
  });

  describe('deleteImg', () => {
    it('이미지 삭제', async () => {
      //given
      // const userDeleteImg: string = {
      //   key: 'asjfkd',
      // };
      //when
      // const userDeleteImgSpy = jest.spyOn(service,'')
      //then
    });
  });

  describe('findPassword', () => {
    it('비밀번호 찾기', async () => {
      //given
      const userFindPasswordDto: UserFindPasswordDto = {
        email: 'email1234@email.com',
        id: new Types.ObjectId(),
      };
      //when
      const userFindPasswordSpy = jest.spyOn(service, 'findPassword');
      await controller.findPassword(userFindPasswordDto);
      //then
      expect(userFindPasswordSpy).toBeCalledWith(userFindPasswordDto);
    });
  });
});
