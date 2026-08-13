package cloud.intensive.kpt.domain.rag.service;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.domain.rag.client.LambdaClient;
import cloud.intensive.kpt.domain.rag.dto.*;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RagServiceImpl implements RagService {

    private final MemberRepository memberRepository;
    private final LambdaClient lambdaClient;

    @Override
    public RagQueryRes query(Long memberId, RagQueryReq request) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "[RagService] member not found",
                        "존재하지 않는 회원입니다."
                ));

        Apartment apartment = member.getUnit()
                .getBuilding()
                .getApartment();

        LambdaResponse response = lambdaClient.query(
                new LambdaRequest(
                        apartment.getId(),
                        request.question()
                )
        );

        return new RagQueryRes(
                response.answer(),
                response.references()
        );
    }
}