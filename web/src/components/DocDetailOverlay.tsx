"use client";

import type { ApartmentDocument } from "@/lib/api/types";
import { DocumentDetailBody } from "./DocumentDetailBody";
import { ArrowLeftIcon } from "./icons";

interface Props {
  doc: ApartmentDocument | null;
  onClose: () => void;
  onAskAbout: (title: string) => void;
}

export function DocDetailOverlay({ doc, onClose, onAskAbout }: Props) {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[420px] flex-col bg-bg">
      <div className="flex flex-none items-center gap-2.5 border-b border-border px-4 pb-3.5 pt-6">
        <button
          onClick={onClose}
          aria-label="뒤로"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-fg transition hover:bg-surface"
        >
          <ArrowLeftIcon />
        </button>
        <p className="font-display text-base font-bold">자료 상세</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <DocumentDetailBody doc={doc} onAskAbout={onAskAbout} />
      </div>
    </div>
  );
}
