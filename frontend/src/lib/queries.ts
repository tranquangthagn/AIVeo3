import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const qk = {
  jobs: (params: Record<string, unknown>) => ["jobs", params] as const,
  job: (id: string) => ["job", id] as const,
  live: () => ["pipeline", "live"] as const,
  config: () => ["config"] as const,
  settings: () => ["settings"] as const,
};

// ─── Queries ───────────────────────────────────────────────────────────────
export function useJobsQuery(params: {
  status?: string;
  verdict?: string;
  search?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: qk.jobs(params),
    queryFn: () => api.listJobs(params),
    staleTime: 5_000,
  });
}

export function useJobQuery(id: string | undefined) {
  return useQuery({
    queryKey: qk.job(id ?? ""),
    queryFn: () => api.getJob(id!),
    enabled: !!id,
    staleTime: 5_000,
  });
}

export function useLiveJobsQuery() {
  return useQuery({
    queryKey: qk.live(),
    queryFn: api.liveJobs,
    refetchInterval: 1_500,
  });
}

export function useConfigQuery() {
  return useQuery({ queryKey: qk.config(), queryFn: api.getConfig });
}

export function useSettingsQuery() {
  return useQuery({ queryKey: qk.settings(), queryFn: api.getSettings });
}

// ─── Mutations ─────────────────────────────────────────────────────────────
export function useApproveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledFor }: { id: string; scheduledFor?: string }) =>
      api.approveJob(id, scheduledFor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

export function useRejectJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.rejectJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

export function usePatchJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { caption?: string; hashtags?: string[] } }) =>
      api.patchJob(id, patch),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: qk.job(id) });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useRegenerateClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, clipId }: { jobId: string; clipId: string }) =>
      api.regenerateClip(jobId, clipId),
    onSuccess: (_, { jobId }) => {
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
    },
  });
}

export function useDeleteClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, clipId }: { jobId: string; clipId: string }) =>
      api.deleteClip(jobId, clipId),
    onSuccess: (_, { jobId }) => {
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
    },
  });
}

export function useGenerateNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, topic }: { title?: string; topic?: string } = {}) =>
      api.generate(title, topic),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.live() });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function usePausePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.pausePipeline(),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.config() }),
  });
}

export function useResumePipeline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.resumePipeline(),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.config() }),
  });
}

export function usePatchConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Record<string, unknown>) => api.patchConfig(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.config() }),
  });
}

export function usePatchSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Record<string, unknown>) => api.patchSettings(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.settings() }),
  });
}
