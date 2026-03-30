import { useState } from "react";
import { GameMeta, CATEGORIES, AUTO_CATS, DIFF_CATS } from "./games.types";

interface Props {
  games: GameMeta[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function GameCategoryTree({ games, selectedCategory, onSelectCategory }: Props) {
  const [openGroup, setOpenGroup] = useState<"auto" | "diff" | null>(null);

  const getCategoryCount = (catId: string) => games.filter(g => g.category === catId).length;

  const renderCats = (cats: typeof CATEGORIES) =>
    cats.map(cat => {
      const count = getCategoryCount(cat.id);
      const active = selectedCategory === cat.id;
      return (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(active ? null : cat.id)}
          className={`w-full flex items-center justify-between px-5 py-2.5 text-left transition-colors text-sm ${
            active
              ? "bg-[#9B5DE5] text-white font-bold"
              : "hover:bg-purple-100 text-gray-600 font-semibold"
          }`}
        >
          <span>{cat.label}</span>
          {count > 0 && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${active ? "bg-white/20 text-white" : "bg-purple-200 text-purple-700"}`}>
              {count}
            </span>
          )}
        </button>
      );
    });

  return (
    <div className="lg:w-72 shrink-0">
      <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-purple-50">
          <p className="font-black text-gray-700 text-sm uppercase tracking-wide">Разделы игр</p>
        </div>

        <div>
          <button
            onClick={() => setOpenGroup(openGroup === "auto" ? null : "auto")}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-purple-50 transition-colors text-left"
          >
            <span className="font-bold text-gray-700 text-sm">🔤 Автоматизация</span>
            <span className="text-gray-400 text-xs">{openGroup === "auto" ? "▲" : "▼"}</span>
          </button>
          {openGroup === "auto" && (
            <div className="bg-purple-50/50 border-t border-purple-100">
              {renderCats(AUTO_CATS)}
            </div>
          )}
        </div>

        <div className="border-t border-purple-100">
          <button
            onClick={() => setOpenGroup(openGroup === "diff" ? null : "diff")}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-purple-50 transition-colors text-left"
          >
            <span className="font-bold text-gray-700 text-sm">🔀 Дифференциация</span>
            <span className="text-gray-400 text-xs">{openGroup === "diff" ? "▲" : "▼"}</span>
          </button>
          {openGroup === "diff" && (
            <div className="bg-purple-50/50 border-t border-purple-100">
              {renderCats(DIFF_CATS)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
