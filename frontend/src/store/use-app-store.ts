import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobStatus } from "@/lib/mock-data";

export type SortKey = "score_desc" | "score_asc" | "newest" | "oldest";
export type VerdictFilter = "all" | "approve_recommended" | "needs_edit" | "reject_recommended";
export type LibraryFilter = "all" | JobStatus;
export type LibrarySort = "newest" | "oldest" | "score_desc" | "views_desc";

interface UiState {
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
}

/**
 * UI-only state. Domain data (jobs, config, settings) lives in TanStack Query cache
 * fetched from the backend.
 */
export const useAppStore = create<UiState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "aiveo3-ui",
      partialize: (s) => ({
        reviewSort: s.reviewSort,
        reviewVerdict: s.reviewVerdict,
        libraryFilter: s.libraryFilter,
        librarySort: s.librarySort,
      }),
      version: 2,
    },
  ),
);

// Server-side sort/filter via API, but keep helpers in case we sort client-side
export function sortLibraryByViews<T extends { views?: number | null }>(jobs: T[]): T[] {
  return [...jobs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
}
