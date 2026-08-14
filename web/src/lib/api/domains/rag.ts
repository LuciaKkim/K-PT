import { httpClient } from "../httpClient";
import type { RagQueryRes } from "../types";

/** POST /api/v1/rag/query */
export function queryRag(question: string, sessionId?: string): Promise<RagQueryRes> {
  return httpClient.post<RagQueryRes>("/api/v1/rag/query", {
    question,
    ...(sessionId ? { sessionId } : {}),
  });
}
