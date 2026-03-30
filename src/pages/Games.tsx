import { useState, useEffect, useRef } from "react";
import func2url from "../../backend/func2url.json";

interface GameMeta {
  filename: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
}

const ADMIN_PASSWORD = "logodeti2024";

const CATEGORIES = [
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

const AUTO_CATS = CATEGORIES.filter(c => c.id.startsWith("auto-"));
const DIFF_CATS = CATEGORIES.filter(c => c.id.startsWith("diff-"));

export default function Games() {
  const [games, setGames] = useState<GameMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameMeta | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<"auto" | "diff" | null>(null);

  const [adminAuth, setAdminAuth] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadEmoji, setUploadEmoji] = useState("🎮");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [editingGame, setEditingGame] = useState<GameMeta | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (!uploadFile || !uploadTitle || !uploadCategory) return;
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
          category: uploadCategory,
          content: base64,
        }),
      });
      setUploading(false);
      if (res.ok) {
        setUploadSuccess(true);
        setUploadTitle("");
        setUploadDesc("");
        setUploadEmoji("🎮");
        setUploadCategory("");
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        fetchGames();
      }
    };
    reader.readAsArrayBuffer(uploadFile);
  };

  const openEdit = (game: GameMeta) => {
    setEditingGame(game);
    setEditCategory(game.category);
    setEditTitle(game.title);
    setEditEmoji(game.emoji);
  };

  const handleSaveEdit = async () => {
    if (!editingGame) return;
    setSaving(true);
    await fetch(func2url["update-game"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: ADMIN_PASSWORD,
        filename: editingGame.filename,
        category: editCategory,
        title: editTitle,
        emoji: editEmoji,
      }),
    });
    setSaving(false);
    setEditingGame(null);
    fetchGames();
  };

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

  const getCategoryCount = (catId: string) => games.filter(g => g.category === catId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Шапка */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-5 hover:text-purple-600 transition-colors">
            ← На главную
          </a>
          <div className="text-5xl mb-3">🎮</div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-2">Игры для речи</h1>
          <p className="text-lg text-gray-500 font-semibold">Выбери раздел и начинай играть!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Левая колонка — дерево категорий */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-md overflow-hidden">
              <div className="px-5 py-4 border-b border-purple-50">
                <p className="font-black text-gray-700 text-sm uppercase tracking-wide">Разделы игр</p>
              </div>

              {/* Группа: Автоматизация */}
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
                    {AUTO_CATS.map(cat => {
                      const count = getCategoryCount(cat.id);
                      const active = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(active ? null : cat.id)}
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
                    })}
                  </div>
                )}
              </div>

              {/* Группа: Дифференциация */}
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
                    {DIFF_CATS.map(cat => {
                      const count = getCategoryCount(cat.id);
                      const active = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(active ? null : cat.id)}
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
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка — игры */}
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
                          <div className="absolute top-3 right-3 flex gap-1">
                            <button
                              onClick={() => openEdit(game)}
                              className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-400 font-black text-sm transition-all flex items-center justify-center shadow-sm"
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(game.filename)}
                              disabled={deletingFile === game.filename}
                              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-400 font-black text-sm transition-all flex items-center justify-center shadow-sm"
                              title="Удалить игру"
                            >
                              {deletingFile === game.filename ? "…" : "✕"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Кнопка входа администратора */}
        <div className="text-center mt-10">
          {!adminAuth ? (
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="text-gray-300 text-xs hover:text-purple-400 transition-colors"
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

        {/* Форма входа */}
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

        {/* Панель загрузки (только для админа) */}
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
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300 bg-white text-gray-700"
              >
                <option value="">— Выберите раздел * —</option>
                <optgroup label="Автоматизация">
                  {AUTO_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </optgroup>
                <optgroup label="Дифференциация">
                  {DIFF_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </optgroup>
              </select>
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
                disabled={!uploadFile || !uploadTitle || !uploadCategory || uploading}
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

      {/* Панель всех игр для админа */}
      {adminAuth && games.length > 0 && (
        <div className="mt-6 bg-white rounded-3xl border-2 border-blue-100 shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="font-black text-gray-800 text-lg mb-4">📋 Все игры — смена раздела</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {games.map(game => (
              <div key={game.filename} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50">
                <span className="text-xl shrink-0">{game.emoji}</span>
                <span className="font-semibold text-gray-700 flex-1 text-sm truncate">{game.title}</span>
                <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                  {CATEGORIES.find(c => c.id === game.category)?.label || "—"}
                </span>
                <button
                  onClick={() => openEdit(game)}
                  className="shrink-0 text-xs bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 font-bold px-3 py-1.5 rounded-xl transition-colors"
                >
                  Изменить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {editingGame && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h3 className="font-black text-gray-800 text-xl mb-5">✏️ Редактировать игру</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editEmoji}
                  onChange={(e) => setEditEmoji(e.target.value)}
                  className="w-20 border-2 border-purple-100 rounded-2xl px-3 py-3 font-semibold text-center text-xl focus:outline-none focus:border-purple-300"
                />
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
                  placeholder="Название"
                />
              </div>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300 bg-white text-gray-700"
              >
                <option value="">— Выберите раздел —</option>
                <optgroup label="Автоматизация">
                  {AUTO_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </optgroup>
                <optgroup label="Дифференциация">
                  {DIFF_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </optgroup>
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingGame(null)}
                  className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editCategory}
                  className="flex-1 bg-[#9B5DE5] text-white font-black py-3 rounded-2xl hover:bg-purple-700 transition-colors disabled:opacity-40"
                >
                  {saving ? "Сохраняем..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Полноэкранный плеер */}
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