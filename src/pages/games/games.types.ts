export interface GameMeta {
  filename: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
}

export const ADMIN_PASSWORD = "logodeti2024";

export const CATEGORIES = [
  { id: "auto-ch", label: 'Автоматизация "Ч"' },
  { id: "auto-r", label: 'Автоматизация "Р"' },
  { id: "auto-rj", label: 'Автоматизация "Рь"' },
  { id: "auto-sch", label: 'Автоматизация "Щ"' },
  { id: "auto-zh", label: 'Автоматизация "Ж"' },
  { id: "auto-s", label: 'Автоматизация "С"' },
  { id: "auto-sj", label: 'Автоматизация "Сь"' },
  { id: "auto-l", label: 'Автоматизация "Л"' },
  { id: "auto-lj", label: 'Автоматизация "Ль"' },
  { id: "auto-z", label: 'Автоматизация "З"' },
  { id: "auto-zj", label: 'Автоматизация "Зь"' },
  { id: "auto-sh", label: 'Автоматизация "Ш"' },
  { id: "auto-h", label: 'Автоматизация "Х"' },
  { id: "auto-g", label: 'Автоматизация "Г"' },
  { id: "auto-k", label: 'Автоматизация "К"' },
  { id: "diff-s-sj", label: 'Дифференциация "С-Сь"' },
  { id: "diff-s-z", label: 'Дифференциация "С-З"' },
  { id: "diff-z-zj", label: 'Дифференциация "З-Зь"' },
  { id: "diff-s-c", label: 'Дифференциация "С-Ц"' },
  { id: "diff-s-sh", label: 'Дифференциация "С-Ш"' },
  { id: "diff-sh-zh", label: 'Дифференциация "Ш-Ж"' },
  { id: "diff-z-zh", label: 'Дифференциация "З-Ж"' },
  { id: "diff-sj-sch", label: 'Дифференциация "Сь-Щ"' },
  { id: "diff-ch-sch", label: 'Дифференциация "Ч-Щ"' },
  { id: "diff-r-rj", label: 'Дифференциация "Р-Рь"' },
  { id: "diff-l-r", label: 'Дифференциация "Л-Р"' },
];

export const AUTO_CATS = CATEGORIES.filter(c => c.id.startsWith("auto-"));
export const DIFF_CATS = CATEGORIES.filter(c => c.id.startsWith("diff-"));
