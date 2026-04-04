import { useState, useEffect } from "react";
import func2url from "../../backend/func2url.json";
import { GameMeta, ADMIN_PASSWORD, CATEGORIES, AUTO_CATS, DIFF_CATS } from "./games/games.types";
import GameAdminPanel from "./games/GameAdminPanel";
import GamePlayer from "./games/GamePlayer";

export default function Games() {
  const [games, setGames] = useState<GameMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameMeta | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<"auto" | "diff">("auto");
  const [adminAuth, setAdminAuth] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(func2url["list-games"]);
      const data = await res.json();
      setGames(data.games || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  useEffect(() => {
    const cats = activeGroup === "auto" ? AUTO_CATS : DIFF_CATS;
    const currentValid = cats.find(c => c.id === selectedCategory);
    if (!currentValid) setSelectedCategory(cats[0]?.id ?? null);
  }, [activeGroup]);

  const handleDelete = async (filename: string) => {
    if (!confirm("Удалить игру?")) return;
    setDeletingFile(filename);
    await fetch(func2url["delete-game"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD, filename }),
    });
    setDeletingFile(null);
    fetchGames();
  };

  const currentCats = activeGroup === "auto" ? AUTO_CATS : DIFF_CATS;
  const filteredGames = selectedCategory
    ? games.filter(g => g.category === selectedCategory)
    : [];
  const selectedLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label;

  const getCategoryCount = (catId: string) => games.filter(g => g.category === catId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-5 hover:text-purple-600 transition-colors text-sm">
            ← На главную
          </a>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎮</div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-[#9B5DE5]">Игры для речи</h1>
              <p className="text-gray-500 font-semibold text-sm mt-0.5">
                {loading ? "Загружаем..." : `${games.length} игр доступно`}
              </p>
            </div>
          </div>
        </div>

        {/* Group tabs */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setActiveGroup("auto")}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
              activeGroup === "auto"
                ? "bg-[#9B5DE5] text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300"
            }`}
          >
            🔤 Автоматизация
          </button>
          <button
            onClick={() => setActiveGroup("diff")}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${
              activeGroup === "diff"
                ? "bg-[#FF6B9D] text-white shadow-lg shadow-pink-200"
                : "bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300"
            }`}
          >
            🔀 Дифференциация
          </button>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {currentCats.map(cat => {
            const count = getCategoryCount(cat.id);
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                  active
                    ? activeGroup === "auto"
                      ? "bg-[#9B5DE5] text-white shadow-md"
                      : "bg-[#FF6B9D] text-white shadow-md"
                    : "bg-white text-gray-600 border-2 border-gray-100 hover:border-purple-200 hover:text-purple-600"
                }`}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-black ${
                    active ? "bg-white/25 text-white" : "bg-purple-100 text-purple-600"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Games grid */}
        {loading ? (
          <div className="text-center py-20 text-2xl text-gray-400 font-bold animate-pulse">Загружаем игры... 🎲</div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-purple-100">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400 font-bold">В этом разделе пока нет игр</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 font-semibold text-sm mb-4">{selectedLabel} — {filteredGames.length} {filteredGames.length === 1 ? "игра" : filteredGames.length < 5 ? "игры" : "игр"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <div key={game.filename} className="relative group">
                  <button
                    onClick={() => setActiveGame(game)}
                    className="w-full bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all text-left"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{game.emoji}</div>
                    <h3 className="font-black text-gray-800 text-base mb-1 leading-tight">{game.title}</h3>
                    {game.description && (
                      <p className="text-gray-400 font-semibold text-xs mb-3 line-clamp-2">{game.description}</p>
                    )}
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${
                      activeGroup === "auto"
                        ? "bg-purple-100 text-[#9B5DE5]"
                        : "bg-pink-100 text-[#FF6B9D]"
                    }`}>
                      ▶ Играть
                    </div>
                  </button>
                  {adminAuth && (
                    <button
                      onClick={() => handleDelete(game.filename)}
                      disabled={deletingFile === game.filename}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-400 font-black text-xs transition-all flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100"
                      title="Удалить игру"
                    >
                      {deletingFile === game.filename ? "…" : "✕"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <GameAdminPanel
          games={games}
          adminAuth={adminAuth}
          onAuthChange={setAdminAuth}
          onRefresh={fetchGames}
        />
      </div>

      {activeGame && (
        <GamePlayer game={activeGame} onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
}
