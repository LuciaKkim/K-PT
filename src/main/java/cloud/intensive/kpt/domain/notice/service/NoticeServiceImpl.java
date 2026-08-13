package cloud.intensive.kpt.domain.notice.service;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.domain.notice.dto.*;
import cloud.intensive.kpt.domain.notice.entity.Notice;
import cloud.intensive.kpt.domain.notice.entity.NoticeStatus;
import cloud.intensive.kpt.domain.notice.repository.NoticeRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<NoticeListRes> getNotices(Long memberId) {

        Apartment apartment = getMember(memberId)
                .getUnit()
                .getBuilding()
                .getApartment();

        return noticeRepository
                .findAllByApartmentIdAndStatusOrderByCreatedAtDesc(
                        apartment.getId(),
                        NoticeStatus.ACTIVE
                )
                .stream()
                .map(notice -> new NoticeListRes(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getWriter().getName(),
                        notice.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public NoticeInfoRes getNotice(Long memberId, Long noticeId) {

        Apartment apartment = getMember(memberId)
                .getUnit()
                .getBuilding()
                .getApartment();

        Notice notice = getNoticeEntity(noticeId);

        validateApartment(apartment.getId(), notice);

        return new NoticeInfoRes(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getWriter().getName(),
                notice.getCreatedAt(),
                notice.getUpdatedAt()
        );
    }

    @Override
    @Transactional
    public void createNotice(Long memberId, CreateNoticeReq request) {

        Member member = getAdmin(memberId);

        Notice notice = Notice.builder()
                .apartment(member.getUnit().getBuilding().getApartment())
                .writer(member)
                .title(request.title())
                .content(request.content())
                .build();

        noticeRepository.save(notice);
    }

    @Override
    @Transactional
    public void updateNotice(Long memberId,
                             Long noticeId,
                             UpdateNoticeReq request) {

        Member member = getAdmin(memberId);
        Notice notice = getNoticeEntity(noticeId);

        validateApartment(
                member.getUnit().getBuilding().getApartment().getId(),
                notice
        );

        notice.update(
                request.title(),
                request.content(),
                false
        );
    }

    @Override
    @Transactional
    public void deleteNotice(Long memberId, Long noticeId) {

        Member member = getAdmin(memberId);
        Notice notice = getNoticeEntity(noticeId);

        validateApartment(
                member.getUnit().getBuilding().getApartment().getId(),
                notice
        );

        notice.delete();
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "[NoticeServiceImpl] member not found",
                        "존재하지 않는 회원입니다."
                ));
    }

    private Member getAdmin(Long memberId) {

        Member member = getMember(memberId);

        if (member.getRole() != MemberRole.ADMIN) {
            throw new BaseException(
                    ErrorCode.FORBIDDEN,
                    "[NoticeServiceImpl] forbidden",
                    "관리자만 접근 가능합니다."
            );
        }

        return member;
    }

    private Notice getNoticeEntity(Long noticeId) {
        return noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.NOT_FOUND,
                        "[NoticeServiceImpl] notice not found",
                        "존재하지 않는 공지입니다."
                ));
    }

    private void validateApartment(Long apartmentId, Notice notice) {

        if (!notice.getApartment().getId().equals(apartmentId)) {
            throw new BaseException(
                    ErrorCode.FORBIDDEN,
                    "[NoticeServiceImpl] different apartment",
                    "다른 아파트의 공지입니다."
            );
        }
    }
}