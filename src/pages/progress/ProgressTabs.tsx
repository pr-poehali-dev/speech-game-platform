import { useNavigate } from "react-router-dom";
import { ProgressData, formatDuration, formatDate, formatDateShort } from "./progress.types";
import Icon from "@/components/ui/icon";

interface Props {
  activeTab: "overview" | "journal" | "sounds";
  data: ProgressData;
  reportText: string;
  copied: boolean;
  onCopy: () => void;
}

export default function ProgressTabs({ activeTab, data, reportText, copied, onCopy }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
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
                onClick={onCopy}
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

          {data.total_sessions === 0 && (
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
  );
}
