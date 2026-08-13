package cloud.intensive.kpt.domain.notice.service;

import cloud.intensive.kpt.domain.notice.dto.*;

import java.util.List;

public interface NoticeService {

    List<NoticeListRes> getNotices(Long memberId);

    NoticeInfoRes getNotice(Long memberId, Long noticeId);

    void createNotice(Long memberId, CreateNoticeReq request);

    void updateNotice(Long memberId, Long noticeId, UpdateNoticeReq request);

    void deleteNotice(Long memberId, Long noticeId);
}