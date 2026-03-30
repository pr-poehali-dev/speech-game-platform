import { useState, useEffect, useRef } from "react";
import func2url from "../../backend/func2url.json";

interface GameMeta {
  filename: string;
  title: string;
  description: string;
  emoji: string;
}

const ADMIN_PASSWORD = "logodeti2024";

export default function Games() {
  const [games, setGames] = useState<GameMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameMeta | null>(null);

  const [adminAuth, setAdminAuth] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadEmoji, setUploadEmoji] = useState("🎮");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handlePassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminAuth(true);
      setPasswordError(false);
      setPasswordInput("");
    } else {
      setPasswordError(true);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return;
    setUploading(true);
    setUploadSuccess(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = btoa(
        new Uint8Array(e.target!.result as ArrayBuffer).reduce(
          (d, b) => d + String.fromCharCode(b), ""
        )
      );
      const res = await fetch(func2url["upload-game"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadFile.name,
          title: uploadTitle,
          description: uploadDesc,
          emoji: uploadEmoji,
          content: base64,
        }),
      });
      setUploading(false);
      if (res.ok) {
        setUploadSuccess(true);
        setUploadTitle("");
        setUploadDesc("");
        setUploadEmoji("🎮");
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        fetchGames();
      }
    };
    reader.readAsArrayBuffer(uploadFile);
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Удалить игру «${filename}»?`)) return;
    setDeletingFile(filename);
    await fetch(func2url["delete-game"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD, filename }),
    });
    setDeletingFile(null);
    fetchGames();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-6 hover:text-purple-600 transition-colors">
            ← На главную
          </a>
          <div className="text-5xl mb-4">🎮</div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-3">Игры для речи</h1>
          <p className="text-xl text-gray-500 font-semibold">Нажми на карточку — и начинай играть!</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-2xl text-gray-400 font-bold animate-pulse">Загружаем игры... 🎲</div>
        ) : games.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-400 font-bold">Пока игр нет. Загрузите первую!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {games.map((game) => (
              <div key={game.filename} className="relative group">
                <button
                  onClick={() => setActiveGame(game)}
                  className="w-full bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-md hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all text-left"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{game.emoji}</div>
                  <h3 className="font-black text-gray-800 text-xl mb-2">{game.title}</h3>
                  {game.description && (
                    <p className="text-gray-500 font-semibold text-sm">{game.description}</p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 bg-purple-100 text-[#9B5DE5] rounded-full px-4 py-1.5 text-sm font-bold">
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

        {/* Панель администратора */}
        <div className="text-center mt-8">
          {!adminAuth ? (
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="text-gray-300 text-xs font-semibold hover:text-purple-400 transition-colors"
            >
              🔑
            </button>
          ) : (
            <button
              onClick={() => { setAdminAuth(false); setAdminOpen(false); setUploadSuccess(false); }}
              className="text-gray-400 text-xs font-semibold hover:text-red-400 transition-colors"
            >
              Выйти из режима администратора
            </button>
          )}
        </div>

        {adminOpen && !adminAuth && (
          <div className="mt-4 bg-white rounded-3xl border-2 border-purple-100 shadow-lg p-8 max-w-sm mx-auto">
            <h3 className="font-black text-gray-800 text-xl mb-4">🔒 Вход для администратора</h3>
            <input
              type="password"
              placeholder="Пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePassword()}
              className={`w-full border-2 rounded-2xl px-4 py-3 font-semibold focus:outline-none transition-all mb-3 ${passwordError ? "border-red-300 bg-red-50" : "border-purple-100 focus:border-purple-300"}`}
            />
            {passwordError && <p className="text-red-400 font-bold text-sm mb-3">Неверный пароль</p>}
            <button
              onClick={handlePassword}
              className="w-full bg-[#9B5DE5] text-white font-black py-3 rounded-2xl hover:bg-purple-700 transition-colors"
            >
              Войти
            </button>
          </div>
        )}

        {adminAuth && (
          <div className="mt-6 bg-white rounded-3xl border-2 border-purple-100 shadow-lg p-8 max-w-lg mx-auto">
            <h3 className="font-black text-gray-800 text-xl mb-5">📤 Загрузить новую игру</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Эмодзи"
                  value={uploadEmoji}
                  onChange={(e) => setUploadEmoji(e.target.value)}
                  className="w-20 border-2 border-purple-100 rounded-2xl px-3 py-3 font-semibold text-center text-xl focus:outline-none focus:border-purple-300"
                />
                <input
                  type="text"
                  placeholder="Название игры *"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="flex-1 border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
                />
              </div>
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
              />
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-purple-200 rounded-2xl px-4 py-5 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                {uploadFile ? (
                  <span className="font-bold text-purple-600">📄 {uploadFile.name}</span>
                ) : (
                  <span className="text-gray-400 font-semibold">📂 Нажмите, чтобы выбрать HTML-файл</span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".html"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadTitle || uploading}
                className="w-full bg-[#FF6B9D] text-white font-black py-3 rounded-2xl hover:bg-pink-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploading ? "Загружаем... ⏳" : "Загрузить игру 🚀"}
              </button>
              {uploadSuccess && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-4 py-3 text-green-700 font-bold text-center">
                  ✅ Игра успешно добавлена!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeGame && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeGame.emoji}</span>
              <h2 className="font-black text-gray-800 text-lg">{activeGame.title}</h2>
            </div>
            <button
              onClick={() => setActiveGame(null)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 font-black text-lg transition-all"
            >
              ✕
            </button>
          </div>
          <iframe
            src={`${func2url["get-game"]}?filename=${encodeURIComponent(activeGame.filename)}`}
            className="w-full flex-1"
            style={{ border: "none", height: "100%" }}
            title={activeGame.title}
          />
        </div>
      )}
    </div>
  );
}
