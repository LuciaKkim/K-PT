"use client";

import { useState } from "react";
import { AppStateProvider, useAppState } from "@/lib/state/AppStateContext";
import type { ApartmentDocument } from "@/lib/api/types";
import { LoginGate } from "@/components/LoginGate";
import { HomePane } from "@/components/HomePane";
import { NoticePane } from "@/components/NoticePane";
import { ComplaintsPane } from "@/components/ComplaintsPane";
import { ComplaintDetailOverlay } from "@/components/ComplaintDetailOverlay";
import { DocsPane } from "@/components/DocsPane";
import { DocDetailOverlay } from "@/components/DocDetailOverlay";
import { MePane } from "@/components/MePane";
import { ComplaintOverlay } from "@/components/ComplaintOverlay";
import { FeatureOverlay } from "@/components/FeatureOverlay";
import { ChatWidget } from "@/components/ChatWidget";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { ScreenGradient } from "@/components/ui/bloom-field-gradient";
import {
  BuildingIcon,
  ChatIcon,
  DocEditIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
} from "@/components/icons";

type Tab = "home" | "notice" | "complaint" | "docs" | "me";

/** 홈·공지·자료실은 기존 단색 배경을 유지하고, 나머지 화면만 그레디언트 배경을 씁니다. */
const GRADIENT_TABS: Tab[] = ["complaint", "me"];

const TABS: { key: Tab; label: string; icon: typeof HomeIcon }[] = [
  { key: "home", label: "홈", icon: HomeIcon },
  { key: "notice", label: "공지", icon: BuildingIcon },
  { key: "complaint", label: "민원", icon: DocEditIcon },
  { key: "docs", label: "자료실", icon: FolderIcon },
  { key: "me", label: "내 정보", icon: UserIcon },
];

function AppShell() {
  const { member, isInitializing } = useAppState();
  const [tab, setTab] = useState<Tab>("home");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string | undefined>();
  const [complaintFormOpen, setComplaintFormOpen] = useState(false);
  const [featureType, setFeatureType] = useState<"visitor" | "vote" | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ApartmentDocument | null>(null);
  const [complaintsRefreshKey, setComplaintsRefreshKey] = useState(0);

  function openChat(question?: string) {
    setChatQuestion(question);
    setChatOpen(true);
  }

  function handleAskAboutDoc(title: string) {
    setSelectedDoc(null);
    openChat(`${title} 내용 알려줘`);
  }

  if (isInitializing) return null;
  if (!member) {
    return <LoginGate />;
  }

  return (
    <PhoneFrame>
      <main className="relative isolate flex h-full w-full flex-col overflow-hidden bg-bg">
        {GRADIENT_TABS.includes(tab) && <ScreenGradient />}
        <div className="min-h-0 flex-1 pb-[70px] pt-5">
          {tab === "home" && (
            <HomePane
              onGoTab={(t) => setTab(t)}
              onOpenComplaintForm={() => setComplaintFormOpen(true)}
              onOpenFeature={(t) => setFeatureType(t)}
            />
          )}
          {tab === "notice" && <NoticePane />}
          {tab === "complaint" && (
            <ComplaintsPane
              onNewComplaint={() => setComplaintFormOpen(true)}
              onOpenDetail={(id) => setSelectedComplaintId(id)}
              refreshKey={complaintsRefreshKey}
            />
          )}
          {tab === "docs" && <DocsPane onOpenDoc={(d) => setSelectedDoc(d)} />}
          {tab === "me" && <MePane />}
        </div>

        {tab === "home" && (
          <button
            onClick={() => openChat()}
            className="absolute bottom-[86px] left-1/2 flex h-14 w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-accent-deep px-[18px] font-brand font-bold text-white shadow-lg shadow-accent-deep/30 transition hover:bg-accent-press"
          >
            <ChatIcon size={20} />
            무엇이든 물어보세요
            <span className="ml-auto rounded-md border border-white/45 px-1.5 py-0.5 text-[11.5px] font-bold">
              AI
            </span>
          </button>
        )}

        <nav
          role="tablist"
          className="absolute bottom-0 left-0 flex h-[70px] w-full bg-accent-deep"
        >
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              role="tab"
              aria-selected={tab === key}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 pb-2 font-brand text-[11px] font-bold text-white transition ${
                tab === key ? "opacity-100" : "opacity-60 hover:opacity-85"
              }`}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </nav>

        <ChatWidget
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          initialQuestion={chatQuestion}
        />
        <ComplaintOverlay
          open={complaintFormOpen}
          onClose={() => setComplaintFormOpen(false)}
          onSubmitted={() => setComplaintsRefreshKey((k) => k + 1)}
        />
        <FeatureOverlay type={featureType} onClose={() => setFeatureType(null)} />
        <ComplaintDetailOverlay
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
        />
        <DocDetailOverlay
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onAskAbout={handleAskAboutDoc}
        />
      </main>
    </PhoneFrame>
  );
}

export default function HomePage() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
