import { useState, useRef } from "react";
import func2url from "../../../backend/func2url.json";
import { GameMeta, ADMIN_PASSWORD, CATEGORIES, AUTO_CATS, DIFF_CATS } from "./games.types";

interface Props {
  games: GameMeta[];
  adminAuth: boolean;
  onAuthChange: (auth: boolean) => void;
  onRefresh: () => void;
}

export default function GameAdminPanel({ games, adminAuth, onAuthChange, onRefresh }: Props) {
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

  const [editingGame, setEditingGame] = useState<GameMeta | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      onAuthChange(true);
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
        onRefresh();
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
    onRefresh();
  };

  const categorySelect = (value: string, onChange: (v: string) => void, placeholder: string) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300 bg-white text-gray-700"
    >
      <option value="">{placeholder}</option>
      <optgroup label="Автоматизация">
        {AUTO_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </optgroup>
      <optgroup label="Дифференциация">
        {DIFF_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </optgroup>
    </select>
  );

  return (
    <>
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
            onClick={() => { onAuthChange(false); setAdminOpen(false); setUploadSuccess(false); }}
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
            {categorySelect(uploadCategory, setUploadCategory, "— Выберите раздел * —")}
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
              {categorySelect(editCategory, setEditCategory, "— Выберите раздел —")}
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
    </>
  );
}
