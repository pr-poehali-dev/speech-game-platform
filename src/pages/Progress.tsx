import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import func2url from "../../backend/func2url.json";
import { getToken, setToken, clearToken, getMe, login, register, logout, User } from "@/lib/auth";
import Icon from "@/components/ui/icon";

interface Session {
  id: number;
  filename: string;
  title: string;
  emoji: string;
  category: string;
  category_label: string;
  started_at: string;
  duration_seconds: number;
}

interface CategoryStat {
  category: string;
  label: string;
  sessions: number;
  total_seconds: number;
  unique_games: number;
}

interface ProgressData {
  total_sessions: number;
  total_seconds: number;
  unique_games: number;
  unique_categories: number;
  streak: number;
  categories: CategoryStat[];
  sessions: Session[];
}

function formatDuration(s: number): string {
  if (s < 60) return `${s} сек`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec ? `${m} мин ${sec} сек` : `${m} мин`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

// ---- Auth form ----
function AuthForm({ onSuccess }: { onSuccess: () => void }) {
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

// ---- Subscription badge ----
function SubBadge({ user }: { user: User }) {
  const planLabels: Record<string, string> = { trial: "Пробный", free: "Бесплатный", pro: "Pro", premium: "Premium" };
  const label = planLabels[user.plan] ?? user.plan;
  const days = user.subscription_days_left;
  const active = user.subscription_active;

  if (!active) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-2 text-sm font-bold">
        <Icon name="AlertCircle" size={16} />
        Подписка истекла
      </div>
    );
  }

  const urgent = days !== null && days <= 3;
  return (
    <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold border ${urgent ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-green-50 border-green-200 text-green-700"}`}>
      <Icon name="CreditCard" size={16} />
      {label}
      {days !== null && <span>· {days === 0 ? "истекает сегодня" : `ещё ${days} дн.`}</span>}
    </div>
  );
}

// ---- Main dashboard ----
export default function Progress() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<ProgressData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "journal" | "sounds">("overview");
  const [reportText, setReportText] = useState("");
  const [copied, setCopied] = useState(false);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) { setAuthLoading(false); return; }
    try {
      const u = await getMe(token);
      setUser(u);
    } catch {
      clearToken();
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const loadProgress = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setDataLoading(true);
    try {
      const res = await fetch(func2url["progress"], { headers: { "X-Auth-Token": token } });
      if (res.ok) setData(await res.json());
    } finally {
      setDataLoading(false);
    }
  }, []);

  const loadReport = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${func2url["progress"]}/report`, { headers: { "X-Auth-Token": token } });
    if (res.ok) {
      const d = await res.json();
      setReportText(d.report || "");
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => { if (user) { loadProgress(); loadReport(); } }, [user, loadProgress, loadReport]);

  const handleLogout = async () => {
    const token = getToken();
    if (token) await logout(token);
    clearToken();
    setUser(null);
    setData(null);
  };

  const handleCopy = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-400 animate-pulse font-bold">Загружаем... 🎲</div>
      </div>
    );
  }

  if (!user) return <AuthForm onSuccess={loadUser} />;

  const stats = [
    { icon: "Gamepad2", label: "Занятий", value: data?.total_sessions ?? 0, color: "text-[#9B5DE5]", bg: "bg-purple-50" },
    { icon: "Clock", label: "Общее время", value: formatDuration(data?.total_seconds ?? 0), color: "text-[#FF6B9D]", bg: "bg-pink-50" },
    { icon: "Layers", label: "Уникальных игр", value: data?.unique_games ?? 0, color: "text-[#4D96FF]", bg: "bg-blue-50" },
    { icon: "Flame", label: "Серия дней", value: `${data?.streak ?? 0} 🔥`, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-purple-400 font-bold mb-3 hover:text-purple-600 transition-colors text-sm">
              ← На главную
            </a>
            <div className="flex items-center gap-3">
              <div className="text-4xl">📊</div>
              <div>
                <h1 className="text-3xl font-black text-[#9B5DE5]">Мониторинг прогресса</h1>
                <p className="text-gray-500 font-semibold text-sm mt-0.5">
                  {user.name || user.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <SubBadge user={user} />
            <button
              onClick={() => navigate("/games")}
              className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-bold px-4 py-2.5 rounded-2xl text-sm hover:scale-105 transition-all"
            >
              🎮 Играть
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 font-bold text-sm transition-colors px-3 py-2.5"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm">
              <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon name={s.icon as Parameters<typeof Icon>[0]["name"]} size={20} className={s.color} />
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 font-semibold text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "journal", "sounds"] as const).map(tab => {
            const labels = { overview: "Обзор", journal: "Журнал", sounds: "По звукам" };
            const icons = { overview: "LayoutDashboard", journal: "ListOrdered", sounds: "AudioWaveform" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab
                    ? "bg-[#9B5DE5] text-white shadow-lg shadow-purple-200"
                    : "bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300"
                }`}
              >
                <Icon name={icons[tab] as Parameters<typeof Icon>[0]["name"]} size={15} />
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {dataLoading && (
          <div className="text-center py-16 text-gray-400 font-bold animate-pulse">Загружаем данные... 🎲</div>
        )}

        {!dataLoading && data && (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Streak calendar-like */}
                {data.streak > 0 && (
                  <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">🔥</div>
                      <div>
                        <div className="text-3xl font-black">{data.streak} {data.streak === 1 ? "день" : data.streak < 5 ? "дня" : "дней"} подряд!</div>
                        <div className="text-white/80 font-semibold">Отличная серия занятий — так держать!</div>
                      </div>
                    </div>
                  </div>
                )}

                {data.streak === 0 && (
                  <div className="bg-white rounded-3xl p-6 border-2 border-purple-100">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="text-3xl">🔥</div>
                      <div>
                        <div className="font-black text-gray-700">Начните серию занятий</div>
                        <div className="font-semibold text-sm">Занимайтесь каждый день и следите за своей серией</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top categories */}
                <div className="bg-white rounded-3xl border-2 border-purple-100 p-6">
                  <h2 className="font-black text-gray-800 text-lg mb-4">Топ разделов</h2>
                  {data.categories.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-gray-400 font-bold">Нет данных — запустите первую игру!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.categories.slice(0, 5).map((c, i) => {
                        const maxSessions = data.categories[0]?.sessions || 1;
                        const pct = Math.round((c.sessions / maxSessions) * 100);
                        return (
                          <div key={c.category}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-700 text-sm">{c.label}</span>
                              <span className="text-xs text-gray-400 font-semibold">{c.sessions} занятий · {formatDuration(c.total_seconds)}</span>
                            </div>
                            <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${pct}%`,
                                  background: i === 0 ? "#9B5DE5" : i === 1 ? "#FF6B9D" : "#4D96FF",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent sessions */}
                <div className="bg-white rounded-3xl border-2 border-purple-100 p-6">
                  <h2 className="font-black text-gray-800 text-lg mb-4">Последние занятия</h2>
                  {data.sessions.length === 0 ? (
                    <p className="text-gray-400 font-bold text-center py-6">Пока нет занятий</p>
                  ) : (
                    <div className="space-y-2">
                      {data.sessions.slice(0, 5).map(s => (
                        <div key={s.id} className="flex items-center gap-3 py-2 border-b border-purple-50 last:border-0">
                          <span className="text-2xl">{s.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 text-sm truncate">{s.title}</div>
                            <div className="text-xs text-gray-400 font-semibold">{s.category_label}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-[#9B5DE5]">{formatDuration(s.duration_seconds)}</div>
                            <div className="text-xs text-gray-400">{formatDateShort(s.started_at)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Report */}
                <div className="bg-white rounded-3xl border-2 border-purple-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-gray-800 text-lg">Отчёт для копирования</h2>
                    <button
                      onClick={handleCopy}
                      disabled={!reportText}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
                        copied ? "bg-green-100 text-green-700" : "bg-purple-100 text-[#9B5DE5] hover:bg-purple-200"
                      }`}
                    >
                      <Icon name={copied ? "Check" : "Copy"} size={15} />
                      {copied ? "Скопировано!" : "Скопировать"}
                    </button>
                  </div>
                  <pre className="text-xs text-gray-600 bg-gray-50 rounded-2xl p-4 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-64">
                    {reportText || "Нет данных для отчёта"}
                  </pre>
                </div>
              </div>
            )}

            {/* JOURNAL */}
            {activeTab === "journal" && (
              <div className="bg-white rounded-3xl border-2 border-purple-100 overflow-hidden">
                {data.sessions.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-gray-400 font-bold">Журнал пуст — откройте первую игру!</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-50 text-left">
                        <th className="px-5 py-3 font-black text-gray-600">Игра</th>
                        <th className="px-5 py-3 font-black text-gray-600 hidden md:table-cell">Раздел</th>
                        <th className="px-5 py-3 font-black text-gray-600">Дата</th>
                        <th className="px-5 py-3 font-black text-gray-600 text-right">Время</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sessions.map((s, i) => (
                        <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{s.emoji}</span>
                              <span className="font-bold text-gray-800 line-clamp-1">{s.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-500 font-semibold hidden md:table-cell">{s.category_label}</td>
                          <td className="px-5 py-3 text-gray-500 font-semibold">{formatDate(s.started_at)}</td>
                          <td className="px-5 py-3 text-right font-bold text-[#9B5DE5]">{formatDuration(s.duration_seconds)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* SOUNDS */}
            {activeTab === "sounds" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.categories.length === 0 ? (
                  <div className="col-span-3 text-center py-20 bg-white rounded-3xl border-2 border-purple-100">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-gray-400 font-bold">Нет данных — запустите первую игру!</p>
                  </div>
                ) : data.categories.map(c => (
                  <div key={c.category} className="bg-white rounded-3xl border-2 border-purple-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="font-black text-gray-800 mb-3 leading-tight">{c.label}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-purple-50 rounded-2xl py-2">
                        <div className="font-black text-[#9B5DE5] text-lg">{c.sessions}</div>
                        <div className="text-xs text-gray-400 font-semibold">занятий</div>
                      </div>
                      <div className="bg-pink-50 rounded-2xl py-2">
                        <div className="font-black text-[#FF6B9D] text-lg">{c.unique_games}</div>
                        <div className="text-xs text-gray-400 font-semibold">игр</div>
                      </div>
                      <div className="bg-blue-50 rounded-2xl py-2">
                        <div className="font-black text-[#4D96FF] text-sm">{formatDuration(c.total_seconds)}</div>
                        <div className="text-xs text-gray-400 font-semibold">время</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!dataLoading && data && data.total_sessions === 0 && (
          <div className="mt-6 bg-gradient-to-r from-[#9B5DE5]/10 to-[#FF6B9D]/10 rounded-3xl p-6 border-2 border-purple-100 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-black text-gray-800 text-lg mb-2">Начните первое занятие!</h3>
            <p className="text-gray-500 font-semibold mb-4">После запуска игры здесь появится статистика</p>
            <button
              onClick={() => navigate("/games")}
              className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-black px-6 py-3 rounded-2xl hover:scale-105 transition-all"
            >
              Открыть игры 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
