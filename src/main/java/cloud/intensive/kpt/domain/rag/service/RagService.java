package cloud.intensive.kpt.domain.rag.service;

import cloud.intensive.kpt.domain.rag.dto.RagQueryReq;
import cloud.intensive.kpt.domain.rag.dto.RagQueryRes;

public interface RagService {

    RagQueryRes query(Long memberId, RagQueryReq request);

}