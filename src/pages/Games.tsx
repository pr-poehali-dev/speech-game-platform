import { useState, useEffect } from "react";
import func2url from "../../backend/func2url.json";
import { GameMeta, ADMIN_PASSWORD, CATEGORIES } from "./games/games.types";
import GameCategoryTree from "./games/GameCategoryTree";
import GameAdminPanel from "./games/GameAdminPanel";
import GamePlayer from "./games/GamePlayer";

export default function Games() {
  const [games, setGames] = useState<GameMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameMeta | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const filteredGames = selectedCategory
    ? games.filter(g => g.category === selectedCategory)
    : [];

  const selectedLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-5 hover:text-purple-600 transition-colors">
            ← На главную
          </a>
          <div className="text-5xl mb-3">🎮</div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-2">Игры для речи</h1>
          <p className="text-lg text-gray-500 font-semibold">Выбери раздел и начинай играть!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <GameCategoryTree
            games={games}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="flex-1">
            {!selectedCategory ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-xl text-gray-400 font-bold">Выбери раздел слева</p>
              </div>
            ) : loading ? (
              <div className="text-center py-20 text-2xl text-gray-400 font-bold animate-pulse">Загружаем... 🎲</div>
            ) : (
              <>
                <h2 className="font-black text-gray-700 text-lg mb-5">{selectedLabel}</h2>
                {filteredGames.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-purple-100">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-gray-400 font-bold">В этом разделе пока нет игр</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredGames.map((game) => (
                      <div key={game.filename} className="relative group">
                        <button
                          onClick={() => setActiveGame(game)}
                          className="w-full bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-md hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all text-left"
                        >
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{game.emoji}</div>
                          <h3 className="font-black text-gray-800 text-lg mb-1">{game.title}</h3>
                          {game.description && (
                            <p className="text-gray-500 font-semibold text-sm">{game.description}</p>
                          )}
                          <div className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-[#9B5DE5] rounded-full px-4 py-1.5 text-sm font-bold">
                            ▶ Играть
                          </div>
                        </button>
                        {adminAuth && (
                          <button
                            onClick={() => handleDelete(game.filename)}
                            disabled={deletingFile === game.filename}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-400 font-black text-sm transition-all flex items-center justify-center shadow-sm"
                            title="Удалить игру"
                          >
                            {deletingFile === game.filename ? "…" : "✕"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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