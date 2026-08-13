package cloud.intensive.kpt.domain.complaint.service;

import cloud.intensive.kpt.domain.complaint.dto.*;

import java.util.List;

public interface ComplaintService {

    void createComplaint(Long memberId, CreateComplaintReq request);

    List<ComplaintListRes> getMyComplaints(Long memberId);

    ComplaintInfoRes getComplaint(Long memberId, Long complaintId);

    List<ComplaintListRes> getApartmentComplaints(Long memberId);

    void updateStatus(Long memberId,
                      Long complaintId,
                      UpdateComplaintStatusReq request);
}