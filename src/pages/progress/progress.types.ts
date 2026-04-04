export interface Session {
  id: number;
  filename: string;
  title: string;
  emoji: string;
  category: string;
  category_label: string;
  started_at: string;
  duration_seconds: number;
}

export interface CategoryStat {
  category: string;
  label: string;
  sessions: number;
  total_seconds: number;
  unique_games: number;
}

export interface ProgressData {
  total_sessions: number;
  total_seconds: number;
  unique_games: number;
  unique_categories: number;
  streak: number;
  categories: CategoryStat[];
  sessions: Session[];
}

export function formatDuration(s: number): string {
  if (s < 60) return `${s} сек`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec ? `${m} мин ${sec} сек` : `${m} мин`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}
