import { useState } from "react";
import { setToken, login, register } from "@/lib/auth";

interface Props {
  onSuccess: () => void;
}

export default function ProgressAuthForm({ onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      let token: string;
      if (mode === "login") {
        const res = await login(email, password);
        token = res.token;
      } else {
        const res = await register(email, password, name);
        token = res.token;
      }
      setToken(token);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-4 hover:text-purple-600 transition-colors text-sm">
            ← На главную
          </a>
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-3xl font-black text-[#9B5DE5]">Мониторинг</h1>
          <p className="text-gray-500 font-semibold mt-1">Войдите, чтобы видеть прогресс занятий</p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-lg p-8">
          <div className="flex gap-2 mb-6 bg-purple-50 p-1 rounded-2xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${mode === "login" ? "bg-white text-[#9B5DE5] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${mode === "register" ? "bg-white text-[#9B5DE5] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-3">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
            />
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full border-2 border-purple-100 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-purple-300"
            />
            {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-black py-3.5 rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Загружаем..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
            {mode === "register" && (
              <p className="text-center text-xs text-gray-400 font-semibold">
                При регистрации вы получаете 14 дней бесплатного доступа
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
