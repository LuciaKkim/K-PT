package cloud.intensive.kpt.domain.complaint.service;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.complaint.dto.ComplaintInfoRes;
import cloud.intensive.kpt.domain.complaint.dto.ComplaintListRes;
import cloud.intensive.kpt.domain.complaint.dto.CreateComplaintReq;
import cloud.intensive.kpt.domain.complaint.dto.UpdateComplaintStatusReq;
import cloud.intensive.kpt.domain.complaint.entity.Complaint;
import cloud.intensive.kpt.domain.complaint.repository.ComplaintRepository;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public void createComplaint(Long memberId, CreateComplaintReq request) {

        Member member = getMember(memberId);

        Complaint complaint = Complaint.builder()
                .apartment(getApartment(member))
                .member(member)
                .category(request.category())
                .title(request.title())
                .content(request.content())
                .location(request.location())
                .build();

        complaintRepository.save(complaint);
    }

    @Override
    public Page<ComplaintListRes> getMyComplaints(
            Long memberId,
            int page,
            int size
    ) {

        getMember(memberId);

        Pageable pageable = PageRequest.of(page, size);

        return complaintRepository
                .findAllByMemberIdOrderByCreatedAtDesc(
                        memberId,
                        pageable
                )
                .map(c -> new ComplaintListRes(
                        c.getId(),
                        c.getCategory(),
                        c.getTitle(),
                        c.getStatus(),
                        c.getCreatedAt()
                ));
    }

    @Override
    public ComplaintInfoRes getComplaint(Long memberId, Long complaintId) {

        Member member = getMember(memberId);
        Complaint complaint = getComplaintEntity(complaintId);

        validateApartment(getApartment(member).getId(), complaint);

        return new ComplaintInfoRes(
                complaint.getId(),
                complaint.getMember().getName(),
                complaint.getCategory(),
                complaint.getTitle(),
                complaint.getContent(),
                complaint.getLocation(),
                complaint.getStatus(),
                complaint.getResolution(),
                complaint.getCreatedAt(),
                complaint.getCompletedAt()
        );
    }

    @Override
    public Page<ComplaintListRes> getApartmentComplaints(
            Long memberId,
            int page,
            int size
    ) {

        Member admin = getAdmin(memberId);

        Pageable pageable = PageRequest.of(page, size);

        return complaintRepository
                .findAllByApartmentIdOrderByCreatedAtDesc(
                        getApartment(admin).getId(),
                        pageable
                )
                .map(c -> new ComplaintListRes(
                        c.getId(),
                        c.getCategory(),
                        c.getTitle(),
                        c.getStatus(),
                        c.getCreatedAt()
                ));
    }

    @Override
    public ComplaintInfoRes getApartmentComplaint(
            Long memberId,
            Long complaintId
    ) {

        Member admin = getAdmin(memberId);
        Complaint complaint = getComplaintEntity(complaintId);

        validateApartment(
                getApartment(admin).getId(),
                complaint
        );

        return new ComplaintInfoRes(
                complaint.getId(),
                complaint.getMember().getName(),
                complaint.getCategory(),
                complaint.getTitle(),
                complaint.getContent(),
                complaint.getLocation(),
                complaint.getStatus(),
                complaint.getResolution(),
                complaint.getCreatedAt(),
                complaint.getCompletedAt()
        );
    }

    @Override
    @Transactional
    public void updateStatus(Long memberId,
                             Long complaintId,
                             UpdateComplaintStatusReq request) {

        Member admin = getAdmin(memberId);
        Complaint complaint = getComplaintEntity(complaintId);

        validateApartment(getApartment(admin).getId(), complaint);

        complaint.updateStatus(
                request.status(),
                request.resolution()
        );
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "[ComplaintService] member not found",
                        "존재하지 않는 회원입니다."
                ));
    }

    private Member getAdmin(Long memberId) {

        Member member = getMember(memberId);

        if (member.getRole() != MemberRole.ADMIN) {
            throw new BaseException(
                    ErrorCode.FORBIDDEN,
                    "[ComplaintService] forbidden",
                    "관리자만 접근 가능합니다."
            );
        }

        return member;
    }

    private Complaint getComplaintEntity(Long complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.COMPLAINT_NOT_FOUND,
                        "[ComplaintService] complaint not found",
                        "존재하지 않는 민원입니다."
                ));
    }

    private Apartment getApartment(Member member) {
        return member.getUnit()
                .getBuilding()
                .getApartment();
    }

    private void validateApartment(Long apartmentId, Complaint complaint) {

        if (!complaint.getApartment().getId().equals(apartmentId)) {
            throw new BaseException(
                    ErrorCode.FORBIDDEN,
                    "[ComplaintService] different apartment",
                    "다른 아파트의 민원입니다."
            );
        }
    }
}