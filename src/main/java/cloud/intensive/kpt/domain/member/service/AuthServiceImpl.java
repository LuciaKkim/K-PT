package cloud.intensive.kpt.domain.member.service;


import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.apartment.repository.UnitRepository;
import cloud.intensive.kpt.domain.member.dto.AuthTokenRes;
import cloud.intensive.kpt.domain.member.dto.CreateMemberReq;
import cloud.intensive.kpt.domain.member.dto.LoginReq;
import cloud.intensive.kpt.domain.member.dto.MemberInfoRes;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import cloud.intensive.kpt.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final MemberRepository memberRepository;
    private final UnitRepository unitRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public void signup(CreateMemberReq dto) {

        if (memberRepository.existsByEmail(dto.email())) {
            throw new BaseException(
                    ErrorCode.DUPLICATE_EMAIL,
                    "[AuthServiceImpl#signup] duplicate email",
                    "이미 가입된 이메일입니다."
            );
        }

        Unit unit = unitRepository.findById(dto.unitId())
                .orElseThrow(() ->
                        new BaseException(
                                ErrorCode.UNIT_NOT_FOUND,
                                "[AuthServiceImpl#signup] unit not found",
                                "존재하지 않는 호수입니다."
                        ));

        Member member = Member.builder()
                .name(dto.name())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .role(MemberRole.USER)
                .unit(unit)
                .build();

        memberRepository.save(member);
    }

    @Override
    public AuthTokenRes login(LoginReq dto) {

        Member member = memberRepository.findByEmail(dto.email())
                .orElseThrow(() ->
                        new BaseException(
                                ErrorCode.MEMBER_NOT_FOUND,
                                "[AuthServiceImpl#login] member not found",
                                "이메일 또는 비밀번호가 올바르지 않습니다."
                        ));

        if (!passwordEncoder.matches(dto.password(), member.getPassword())) {
            throw new BaseException(
                    ErrorCode.INVALID_PASSWORD,
                    "[AuthServiceImpl#login] invalid password",
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        String accessToken = jwtProvider.createAccessToken(
                member.getId(),
                member.getEmail(),
                member.getRole().name()
        );

        return AuthTokenRes.of(accessToken);
    }

    @Override
    public MemberInfoRes getMyInfo(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new BaseException(
                                ErrorCode.MEMBER_NOT_FOUND,
                                "[AuthServiceImpl#getMyInfo] member not found",
                                "존재하지 않는 회원입니다."
                        ));

        return new MemberInfoRes(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getUnit().getBuilding().getApartment().getName(),
                member.getUnit().getBuilding().getBuildingNumber(),
                member.getUnit().getUnitNumber()
        );
    }
}