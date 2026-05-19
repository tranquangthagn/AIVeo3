export type JobStatus =
  | "queued"
  | "generating_idea"
  | "writing_script"
  | "generating_video"
  | "assembling"
  | "scoring"
  | "review"
  | "approved"
  | "published"
  | "rejected"
  | "failed";

export type Verdict = "approve_recommended" | "needs_edit" | "reject_recommended";

export interface ScoreBreakdown {
  hook: { score: number; weight: number; feedback: string };
  visual: { score: number; weight: number; feedback: string };
  audio: { score: number; weight: number; feedback: string };
  caption: { score: number; weight: number; feedback: string };
  trend: { score: number; weight: number; feedback: string };
}

export interface Clip {
  id: string;
  index: number;
  duration: number;
  prompt: string;
  thumbnail: string;
  warning?: string;
}

export interface VideoJob {
  id: string;
  title: string;
  topic: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  thumbnail: string;
  duration: number;
  aiScore: number;
  verdict?: Verdict;
  scoreBreakdown?: ScoreBreakdown;
  suggestions?: string[];
  caption?: string;
  hashtags?: string[];
  clips?: Clip[];
  views?: number;
  likes?: number;
  publishedAt?: string;
  scheduledFor?: string;
}

const thumb = (seed: string, hue = 270) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 640'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='hsl(${hue},80%,55%)'/>
          <stop offset='100%' stop-color='hsl(${(hue + 40) % 360},80%,40%)'/>
        </linearGradient>
        <radialGradient id='r' cx='30%' cy='30%' r='60%'>
          <stop offset='0%' stop-color='white' stop-opacity='0.25'/>
          <stop offset='100%' stop-color='white' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='360' height='640' fill='url(#g)'/>
      <rect width='360' height='640' fill='url(#r)'/>
      <text x='180' y='340' text-anchor='middle' font-family='Geist,sans-serif' font-size='28' font-weight='700' fill='white' opacity='0.95'>${seed}</text>
    </svg>`
  )}`;

export const stats = {
  generatedToday: 5,
  quotaToday: 10,
  pendingReview: 3,
  costToday: 12.4,
  costCap: 20,
  publishedToday: 2,
  publishedViews: 1240,
};

export const reviewQueue: VideoJob[] = [
  {
    id: "job-1247",
    title: "5 mẹo dùng AI tăng productivity",
    topic: "AI productivity",
    status: "review",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    thumbnail: thumb("5 mẹo AI", 270),
    duration: 35,
    aiScore: 87,
    verdict: "approve_recommended",
    scoreBreakdown: {
      hook: { score: 9, weight: 30, feedback: "Câu hỏi mở đầu cuốn hút, hook trong 2s đầu rất mạnh." },
      visual: { score: 8, weight: 20, feedback: "Clip 3 có nhiễu nhẹ ở giây 0:18, các clip còn lại sharp." },
      audio: { score: 8, weight: 15, feedback: "Voiceover hơi chậm so với cut. Music khớp beat ổn." },
      caption: { score: 9, weight: 15, feedback: "CTA mạnh, mix hashtag trending + niche cân đối." },
      trend: { score: 7, weight: 20, feedback: "Topic OK nhưng chưa nằm trong peak trend tuần này." },
    },
    suggestions: [
      "Re-generate scene 3 để fix nhiễu visual",
      "Thêm hashtag #AIVietNam và #productivity2026",
      "Tăng speed voiceover lên 1.1x cho khớp cut",
    ],
    caption: "5 cách dùng AI tăng x2 productivity 🚀 Bạn áp dụng cái nào đầu tiên?",
    hashtags: ["#ai", "#productivity", "#aivietnam", "#fyp"],
    clips: [
      { id: "c1", index: 1, duration: 5, prompt: "Person looking at glowing AI screens, dramatic light", thumbnail: thumb("1", 270) },
      { id: "c2", index: 2, duration: 6, prompt: "Hands typing on laptop, code flowing", thumbnail: thumb("2", 260) },
      { id: "c3", index: 3, duration: 8, prompt: "Split screen comparing tasks", thumbnail: thumb("3", 250), warning: "Visual jitter at 0:18" },
      { id: "c4", index: 4, duration: 8, prompt: "Calendar auto-filling with smart blocks", thumbnail: thumb("4", 240) },
      { id: "c5", index: 5, duration: 8, prompt: "Happy creator with finished work, sunset", thumbnail: thumb("5", 230) },
    ],
  },
  {
    id: "job-1245",
    title: "Veo3 vs Sora — ai mạnh hơn?",
    topic: "AI video comparison",
    status: "review",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    thumbnail: thumb("Veo3 vs Sora", 200),
    duration: 42,
    aiScore: 64,
    verdict: "needs_edit",
    scoreBreakdown: {
      hook: { score: 6, weight: 30, feedback: "Hook OK nhưng chậm, mất 4s mới vào main topic." },
      visual: { score: 7, weight: 20, feedback: "Comparison frame rõ, nhưng lighting không đều." },
      audio: { score: 7, weight: 15, feedback: "Voiceover rõ ràng, music ổn." },
      caption: { score: 5, weight: 15, feedback: "Caption hơi dài và thiếu CTA." },
      trend: { score: 8, weight: 20, feedback: "Trend tốt — AI comparison đang hot." },
    },
    suggestions: ["Rút hook xuống 2s", "Viết lại caption ngắn hơn + thêm CTA"],
    caption: "So sánh Veo3 và Sora chi tiết, đâu là tool tốt hơn cho creator?",
    hashtags: ["#ai", "#veo3", "#sora"],
    clips: [],
  },
  {
    id: "job-1244",
    title: "AI Agent là gì? 60s giải thích",
    topic: "AI education",
    status: "review",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    thumbnail: thumb("AI Agent", 340),
    duration: 58,
    aiScore: 42,
    verdict: "reject_recommended",
    scoreBreakdown: {
      hook: { score: 3, weight: 30, feedback: "Hook yếu, mở đầu là định nghĩa khô khan." },
      visual: { score: 6, weight: 20, feedback: "Visual ổn, nhưng nhiều text wall." },
      audio: { score: 5, weight: 15, feedback: "Voiceover monotone, thiếu cảm xúc." },
      caption: { score: 4, weight: 15, feedback: "Caption thiếu hook." },
      trend: { score: 5, weight: 20, feedback: "Topic basic, đã có nhiều video tương tự." },
    },
    suggestions: ["Re-generate toàn bộ với hook hấp dẫn hơn", "Pick angle mới: AI Agent thay developer?"],
    caption: "AI Agent là gì?",
    hashtags: ["#ai"],
    clips: [],
  },
];

export const livePipeline: VideoJob[] = [
  {
    id: "job-1248",
    title: "Tại sao Veo3 thay đổi content creation",
    topic: "AI video",
    status: "generating_video",
    progress: 55,
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    thumbnail: thumb("Veo3 changes", 285),
    duration: 0,
    aiScore: 0,
  },
  {
    id: "job-1249",
    title: "10 prompt Veo3 viral nhất tuần này",
    topic: "AI prompt",
    status: "writing_script",
    progress: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    thumbnail: thumb("10 viral prompts", 305),
    duration: 0,
    aiScore: 0,
  },
];

export const recentPublished: VideoJob[] = [
  {
    id: "job-1242",
    title: "Veo3 vs Sora — ai mạnh hơn?",
    topic: "comparison",
    status: "published",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    thumbnail: thumb("Veo3 vs Sora", 200),
    duration: 42,
    aiScore: 92,
    views: 5420,
    likes: 412,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "job-1241",
    title: "Tôi để AI viết content 30 ngày, kết quả?",
    topic: "AI experiment",
    status: "published",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    thumbnail: thumb("AI 30 ngày", 175),
    duration: 38,
    aiScore: 89,
    views: 12300,
    likes: 1050,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
  },
];

export const trendingTopics = [
  { topic: "AI Agent tự build app", heat: 94 },
  { topic: "Veo3 vs Sora comparison", heat: 88 },
  { topic: "Productivity hack 2026", heat: 81 },
  { topic: "Prompt engineering tips", heat: 76 },
  { topic: "Creator workflow tự động", heat: 71 },
];

export const todaySchedule = [
  { time: "08:00", action: "Auto-gen 3 video", status: "done" as const },
  { time: "14:00", action: "Auto-gen 2 video", status: "running" as const },
  { time: "19:00", action: "Auto-publish approved", status: "pending" as const },
];

export const libraryItems: VideoJob[] = [
  ...recentPublished,
  ...reviewQueue.map((v) => ({ ...v })),
  {
    id: "job-1240",
    title: "ChatGPT vs Claude — pick ai?",
    topic: "AI tools",
    status: "approved",
    progress: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    thumbnail: thumb("ChatGPT vs Claude", 150),
    duration: 40,
    aiScore: 78,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
  },
];

export const channels = [
  { id: "tech-vn", name: "Tech Insights VN", handle: "@aiveo3.vn", followers: 12300, active: true },
];
