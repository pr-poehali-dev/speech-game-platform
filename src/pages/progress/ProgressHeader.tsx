import { useNavigate } from "react-router-dom";
import { User } from "@/lib/auth";
import { ProgressData, formatDuration } from "./progress.types";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  data: ProgressData | null;
  activeTab: "overview" | "journal" | "sounds";
  onTabChange: (tab: "overview" | "journal" | "sounds") => void;
  onLogout: () => void;
}

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

export default function ProgressHeader({ user, data, activeTab, onTabChange, onLogout }: Props) {
  const navigate = useNavigate();

  const stats = [
    { icon: "Gamepad2", label: "Занятий", value: data?.total_sessions ?? 0, color: "text-[#9B5DE5]", bg: "bg-purple-50" },
    { icon: "Clock", label: "Общее время", value: formatDuration(data?.total_seconds ?? 0), color: "text-[#FF6B9D]", bg: "bg-pink-50" },
    { icon: "Layers", label: "Уникальных игр", value: data?.unique_games ?? 0, color: "text-[#4D96FF]", bg: "bg-blue-50" },
    { icon: "Flame", label: "Серия дней", value: `${data?.streak ?? 0} 🔥`, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Обзор", icon: "LayoutDashboard" },
    { id: "journal" as const, label: "Журнал", icon: "ListOrdered" },
    { id: "sounds" as const, label: "По звукам", icon: "AudioWaveform" },
  ];

  return (
    <>
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
            onClick={onLogout}
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-[#9B5DE5] text-white shadow-lg shadow-purple-200"
                : "bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300"
            }`}
          >
            <Icon name={tab.icon as Parameters<typeof Icon>[0]["name"]} size={15} />
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
