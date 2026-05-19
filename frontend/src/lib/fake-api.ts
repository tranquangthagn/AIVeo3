export function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function maybeFail(rate = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => (Math.random() < rate ? reject(new Error("Network error")) : resolve()), 300);
  });
}

const hashtagPool = [
  "#fyp",
  "#aitools",
  "#productivity2026",
  "#aivietnam",
  "#tech",
  "#creator",
  "#veo3",
  "#viralvideo",
  "#trendingnow",
  "#promptengineering",
];

export async function suggestHashtags(existing: string[]): Promise<string[]> {
  await delay(null, 800);
  const pool = hashtagPool.filter((h) => !existing.includes(h));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export async function regenerateScene(): Promise<void> {
  await delay(null, 1500);
}
