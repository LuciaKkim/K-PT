package cloud.intensive.kpt.domain.complaint.service;

import cloud.intensive.kpt.domain.complaint.dto.ComplaintInfoRes;
import cloud.intensive.kpt.domain.complaint.dto.ComplaintListRes;
import cloud.intensive.kpt.domain.complaint.dto.CreateComplaintReq;
import cloud.intensive.kpt.domain.complaint.dto.UpdateComplaintStatusReq;
import org.springframework.data.domain.Page;

public interface ComplaintService {

    void createComplaint(Long memberId, CreateComplaintReq request);

    Page<ComplaintListRes> getMyComplaints(
            Long memberId,
            int page,
            int size
    );

    ComplaintInfoRes getComplaint(Long memberId, Long complaintId);

    ComplaintInfoRes getApartmentComplaint(
            Long memberId,
            Long complaintId
    );

    Page<ComplaintListRes> getApartmentComplaints(
            Long memberId,
            int page,
            int size
    );

    void updateStatus(Long memberId,
                      Long complaintId,
                      UpdateComplaintStatusReq request);
}