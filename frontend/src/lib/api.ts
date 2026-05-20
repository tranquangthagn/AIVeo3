import type { VideoJob } from "@/lib/mock-data";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface ApiJob {
  id: string;
  title: string;
  topic: string;
  status: string;
  progress: number;
  caption?: string | null;
  hashtags?: string[] | null;
  thumbnail_url?: string | null;
  video_url?: string | null;
  duration: number;
  ai_score: number;
  verdict?: string | null;
  suggestions?: string[] | null;
  views?: number | null;
  likes?: number | null;
  error_message?: string | null;
  created_at: string;
  scored_at?: string | null;
  published_at?: string | null;
  scheduled_for?: string | null;
  score_breakdown?: Array<{ criterion: string; score: number; weight: number; feedback: string }>;
  clips?: Array<{
    id: string;
    idx: number;
    duration: number;
    prompt: string;
    thumbnail?: string | null;
    video_url?: string | null;
    warning?: string | null;
  }>;
}

/** Normalize backend job → frontend VideoJob shape. */
export function normalizeJob(j: ApiJob): VideoJob {
  const sb = j.score_breakdown ?? [];
  const scoreBreakdown = sb.length
    ? {
        hook: pickCriterion(sb, "hook"),
        visual: pickCriterion(sb, "visual"),
        audio: pickCriterion(sb, "audio"),
        caption: pickCriterion(sb, "caption"),
        trend: pickCriterion(sb, "trend"),
      }
    : undefined;

  return {
    id: j.id,
    title: j.title,
    topic: j.topic,
    status: j.status as VideoJob["status"],
    progress: j.progress,
    createdAt: j.created_at,
    thumbnail: j.thumbnail_url ?? "",
    duration: j.duration,
    aiScore: j.ai_score,
    verdict: (j.verdict ?? undefined) as VideoJob["verdict"],
    scoreBreakdown,
    suggestions: j.suggestions ?? undefined,
    caption: j.caption ?? undefined,
    hashtags: j.hashtags ?? undefined,
    clips: j.clips?.map((c) => ({
      id: c.id,
      index: c.idx,
      duration: c.duration,
      prompt: c.prompt,
      thumbnail: c.thumbnail ?? "",
      warning: c.warning ?? undefined,
    })),
    views: j.views ?? undefined,
    likes: j.likes ?? undefined,
    publishedAt: j.published_at ?? undefined,
    scheduledFor: j.scheduled_for ?? undefined,
  };
}

function pickCriterion(
  sb: Array<{ criterion: string; score: number; weight: number; feedback: string }>,
  name: string,
) {
  const item = sb.find((s) => s.criterion === name);
  return item
    ? { score: item.score, weight: item.weight, feedback: item.feedback }
    : { score: 0, weight: 0, feedback: "" };
}

// ─── Jobs ──────────────────────────────────────────────────────────────────
export const api = {
  listJobs: async (params: {
    status?: string;
    verdict?: string;
    search?: string;
    sort?: string;
    limit?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.verdict) qs.set("verdict", params.verdict);
    if (params.search) qs.set("search", params.search);
    if (params.sort) qs.set("sort", params.sort);
    if (params.limit) qs.set("limit", String(params.limit));
    const jobs = await http<ApiJob[]>(`/api/jobs?${qs.toString()}`);
    return jobs.map(normalizeJob);
  },

  getJob: async (id: string) => {
    const j = await http<ApiJob>(`/api/jobs/${id}`);
    return normalizeJob(j);
  },

  patchJob: async (id: string, patch: { caption?: string; hashtags?: string[] }) => {
    const j = await http<ApiJob>(`/api/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return normalizeJob(j);
  },

  approveJob: async (id: string, scheduledFor?: string) => {
    const j = await http<ApiJob>(`/api/jobs/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ scheduled_for: scheduledFor ?? null }),
    });
    return normalizeJob(j);
  },

  rejectJob: async (id: string) => {
    const j = await http<ApiJob>(`/api/jobs/${id}/reject`, { method: "POST" });
    return normalizeJob(j);
  },

  deleteClip: (jobId: string, clipId: string) =>
    http<{ ok: boolean }>(`/api/jobs/${jobId}/clips/${clipId}`, { method: "DELETE" }),

  regenerateClip: (jobId: string, clipId: string) =>
    http<{ ok: boolean; regen_count: number }>(
      `/api/jobs/${jobId}/clips/${clipId}/regenerate`,
      { method: "POST" },
    ),

  // ─── Pipeline ────────────────────────────────────────────────────────────
  liveJobs: async () => {
    const jobs = await http<ApiJob[]>(`/api/pipeline/live`);
    return jobs.map(normalizeJob);
  },

  generate: async (title?: string, topic?: string) => {
    const j = await http<ApiJob>(`/api/pipeline/generate`, {
      method: "POST",
      body: JSON.stringify({ title: title ?? null, topic: topic ?? null }),
    });
    return normalizeJob(j);
  },

  pausePipeline: () => http<{ paused: boolean }>(`/api/pipeline/pause`, { method: "POST" }),
  resumePipeline: () => http<{ paused: boolean }>(`/api/pipeline/resume`, { method: "POST" }),
  tickPipeline: () => http<{ ticked: number }>(`/api/pipeline/tick`, { method: "POST" }),

  // ─── Config / Settings ───────────────────────────────────────────────────
  getConfig: () =>
    http<{
      niche: string;
      audience: string;
      tone: string;
      quota: number;
      days: Record<string, boolean>;
      slots: string[];
      paused: boolean;
    }>(`/api/config`),

  patchConfig: (patch: Record<string, unknown>) =>
    http(`/api/config`, { method: "PATCH", body: JSON.stringify(patch) }),

  getSettings: () =>
    http<{
      weights: { hook: number; visual: number; audio: number; caption: number; trend: number };
      auto_approve_threshold: number;
      budget_daily: number;
      budget_monthly: number;
      budget_alert_at: number;
    }>(`/api/settings`),

  patchSettings: (patch: Record<string, unknown>) =>
    http(`/api/settings`, { method: "PATCH", body: JSON.stringify(patch) }),

  // ─── AI ──────────────────────────────────────────────────────────────────
  suggestHashtags: (existing: string[]) =>
    http<{ hashtags: string[] }>(`/api/ai/suggest-hashtags`, {
      method: "POST",
      body: JSON.stringify({ existing }),
    }),
};
