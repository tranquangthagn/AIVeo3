import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  reviewQueue as seedReview,
  recentPublished as seedPublished,
  libraryItems as seedLibrary,
  livePipeline as seedLive,
  type VideoJob,
  type JobStatus,
} from "@/lib/mock-data";

export type SortKey = "score_desc" | "score_asc" | "newest" | "oldest";
export type VerdictFilter = "all" | "approve_recommended" | "needs_edit" | "reject_recommended";
export type LibraryFilter = "all" | JobStatus;
export type LibrarySort = "newest" | "oldest" | "score_desc" | "views_desc";

interface AppState {
  // Data
  reviewQueue: VideoJob[];
  livePipeline: VideoJob[];
  library: VideoJob[];

  // Review Inbox UI
  reviewSort: SortKey;
  reviewVerdict: VerdictFilter;
  reviewSearch: string;
  setReviewSort: (k: SortKey) => void;
  setReviewVerdict: (v: VerdictFilter) => void;
  setReviewSearch: (s: string) => void;

  // Library UI
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearch: string;
  setLibraryFilter: (f: LibraryFilter) => void;
  setLibrarySort: (s: LibrarySort) => void;
  setLibrarySearch: (q: string) => void;

  // Pipeline config
  config: {
    niche: string;
    audience: string;
    tone: "Formal" | "Casual" | "Funny" | "Edu";
    quota: number;
    days: Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", boolean>;
    slots: string[];
    paused: boolean;
  };
  setConfig: (partial: Partial<AppState["config"]>) => void;

  // Settings
  weights: { hook: number; visual: number; audio: number; caption: number; trend: number };
  autoApprove: number;
  budget: { daily: number; monthly: number; alertAt: number };
  setWeights: (w: Partial<AppState["weights"]>) => void;
  setAutoApprove: (n: number) => void;
  setBudget: (b: Partial<AppState["budget"]>) => void;

  // Actions on jobs
  approveJob: (id: string, scheduledFor?: string) => void;
  rejectJob: (id: string) => void;
  saveJobDraft: (id: string, patch: Partial<VideoJob>) => void;
  updateCaption: (id: string, caption: string) => void;
  updateHashtags: (id: string, hashtags: string[]) => void;
  removeClip: (jobId: string, clipId: string) => void;
  reorderClips: (jobId: string, fromIdx: number, toIdx: number) => void;
  tickPipeline: () => void;
  generateNow: () => void;
  pausePipeline: () => void;
  resumePipeline: () => void;
}

const todayIso = () => new Date().toISOString();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      reviewQueue: seedReview,
      livePipeline: seedLive,
      library: seedLibrary,

      reviewSort: "score_desc",
      reviewVerdict: "all",
      reviewSearch: "",
      setReviewSort: (k) => set({ reviewSort: k }),
      setReviewVerdict: (v) => set({ reviewVerdict: v }),
      setReviewSearch: (s) => set({ reviewSearch: s }),

      libraryFilter: "all",
      librarySort: "newest",
      librarySearch: "",
      setLibraryFilter: (f) => set({ libraryFilter: f }),
      setLibrarySort: (s) => set({ librarySort: s }),
      setLibrarySearch: (q) => set({ librarySearch: q }),

      config: {
        niche: "Công nghệ AI, productivity tools",
        audience: "GenZ Việt Nam 18-30, tech enthusiast",
        tone: "Casual",
        quota: 5,
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
        slots: ["08:00", "14:00"],
        paused: false,
      },
      setConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),

      weights: { hook: 30, visual: 20, audio: 15, caption: 15, trend: 20 },
      autoApprove: 90,
      budget: { daily: 20, monthly: 500, alertAt: 80 },
      setWeights: (w) => set((s) => ({ weights: { ...s.weights, ...w } })),
      setAutoApprove: (n) => set({ autoApprove: n }),
      setBudget: (b) => set((s) => ({ budget: { ...s.budget, ...b } })),

      approveJob: (id, scheduledFor) =>
        set((s) => {
          const job = s.reviewQueue.find((j) => j.id === id);
          if (!job) return {};
          const approved: VideoJob = {
            ...job,
            status: scheduledFor ? "approved" : "published",
            scheduledFor,
            publishedAt: scheduledFor ? undefined : todayIso(),
          };
          return {
            reviewQueue: s.reviewQueue.filter((j) => j.id !== id),
            library: [approved, ...s.library.filter((j) => j.id !== id)],
          };
        }),

      rejectJob: (id) =>
        set((s) => {
          const job = s.reviewQueue.find((j) => j.id === id);
          if (!job) return {};
          const rejected: VideoJob = { ...job, status: "rejected" };
          return {
            reviewQueue: s.reviewQueue.filter((j) => j.id !== id),
            library: [rejected, ...s.library.filter((j) => j.id !== id)],
          };
        }),

      saveJobDraft: (id, patch) =>
        set((s) => ({
          reviewQueue: s.reviewQueue.map((j) => (j.id === id ? { ...j, ...patch } : j)),
          library: s.library.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      updateCaption: (id, caption) =>
        set((s) => ({
          reviewQueue: s.reviewQueue.map((j) => (j.id === id ? { ...j, caption } : j)),
        })),

      updateHashtags: (id, hashtags) =>
        set((s) => ({
          reviewQueue: s.reviewQueue.map((j) => (j.id === id ? { ...j, hashtags } : j)),
        })),

      removeClip: (jobId, clipId) =>
        set((s) => ({
          reviewQueue: s.reviewQueue.map((j) =>
            j.id === jobId ? { ...j, clips: (j.clips ?? []).filter((c) => c.id !== clipId) } : j,
          ),
        })),

      reorderClips: (jobId, fromIdx, toIdx) =>
        set((s) => ({
          reviewQueue: s.reviewQueue.map((j) => {
            if (j.id !== jobId || !j.clips) return j;
            const next = [...j.clips];
            const [moved] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, moved);
            return { ...j, clips: next.map((c, i) => ({ ...c, index: i + 1 })) };
          }),
        })),

      tickPipeline: () =>
        set((s) => {
          if (s.config.paused) return {};
          const next = s.livePipeline.map((j) => {
            const increment = Math.random() * 4 + 1;
            const progress = Math.min(100, j.progress + increment);
            let status = j.status;
            if (progress > 35 && j.status === "writing_script") status = "generating_video";
            if (progress > 75 && j.status === "generating_video") status = "assembling";
            if (progress >= 100) status = "scoring";
            return { ...j, progress, status };
          });
          return { livePipeline: next };
        }),

      generateNow: () =>
        set((s) => {
          const ideas = [
            "Top 3 AI tools cho creator 2026",
            "Cách dùng Veo3 tạo video viral",
            "Một ngày dùng AI thay assistant",
          ];
          const idea = ideas[Math.floor(Math.random() * ideas.length)];
          const newJob: VideoJob = {
            id: `job-${Math.floor(1300 + Math.random() * 999)}`,
            title: idea,
            topic: "AI productivity",
            status: "generating_idea",
            progress: 5,
            createdAt: todayIso(),
            thumbnail: seedLive[0].thumbnail,
            duration: 0,
            aiScore: 0,
          };
          return { livePipeline: [newJob, ...s.livePipeline] };
        }),

      pausePipeline: () => set((s) => ({ config: { ...s.config, paused: true } })),
      resumePipeline: () => set((s) => ({ config: { ...s.config, paused: false } })),
    }),
    {
      name: "aiveo3-store",
      partialize: (s) => ({
        // Persist config + UI prefs + jobs so refresh feels real
        config: s.config,
        weights: s.weights,
        autoApprove: s.autoApprove,
        budget: s.budget,
        reviewSort: s.reviewSort,
        reviewVerdict: s.reviewVerdict,
        libraryFilter: s.libraryFilter,
        librarySort: s.librarySort,
        reviewQueue: s.reviewQueue,
        library: s.library,
      }),
      version: 1,
    },
  ),
);

// Derived selectors
export function sortJobs(jobs: VideoJob[], sort: SortKey): VideoJob[] {
  const copy = [...jobs];
  switch (sort) {
    case "score_desc":
      return copy.sort((a, b) => b.aiScore - a.aiScore);
    case "score_asc":
      return copy.sort((a, b) => a.aiScore - b.aiScore);
    case "newest":
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "oldest":
      return copy.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }
}

export function sortLibrary(jobs: VideoJob[], sort: LibrarySort): VideoJob[] {
  const copy = [...jobs];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "oldest":
      return copy.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    case "score_desc":
      return copy.sort((a, b) => b.aiScore - a.aiScore);
    case "views_desc":
      return copy.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  }
}
