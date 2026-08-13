package cloud.intensive.kpt.domain.member.service;


import cloud.intensive.kpt.domain.member.dto.AuthTokenRes;
import cloud.intensive.kpt.domain.member.dto.CreateMemberReq;
import cloud.intensive.kpt.domain.member.dto.LoginReq;
import cloud.intensive.kpt.domain.member.dto.MemberInfoRes;

public interface AuthService {

    /**
     * 회원가입을 수행합니다.
     *
     * @param dto 회원가입 요청 DTO
     */
    void signup(CreateMemberReq dto);

    /**
     * 로그인 후 JWT Access Token을 발급합니다.
     *
     * @param dto 로그인 요청 DTO
     * @return Access Token
     */
    AuthTokenRes login(LoginReq dto);

    /**
     * 로그인한 회원 정보를 조회합니다.
     *
     * @param memberId 회원 ID
     * @return 회원 정보
     */
    MemberInfoRes getMyInfo(Long memberId);
}