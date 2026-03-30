import { useNavigate } from "react-router-dom";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/45a7bdc2-bd26-485c-aba5-63edefe5f89d/files/fe0403e8-cddb-42a9-9296-38e3722a62d2.jpg";

const GAMES = [
  {
    emoji: "🦁",
    title: "Рык льва",
    desc: "Тренируем букву Р через весёлые звуки животных",
    age: "4–6 лет",
    color: "#FFD93D",
    bg: "#FFF9E3",
    tags: ["Звукопроизношение", "Р"],
  },
  {
    emoji: "🐍",
    title: "Змейка шипит",
    desc: "Упражнения на шипящие звуки Ш, Ж, Щ в игровой форме",
    age: "4–7 лет",
    color: "#6BCB77",
    bg: "#EDFFF0",
    tags: ["Дикция", "Ш-Ж-Щ"],
  },
  {
    emoji: "🎵",
    title: "Песенка язычка",
    desc: "Артикуляционная гимнастика под весёлую музыку",
    age: "3–5 лет",
    color: "#4D96FF",
    bg: "#EEF5FF",
    tags: ["Артикуляция", "Для малышей"],
  },
  {
    emoji: "🎯",
    title: "Попади в цель",
    desc: "Угадывай слова и тренируй чёткость произношения",
    age: "5–8 лет",
    color: "#FF6B9D",
    bg: "#FFF0F5",
    tags: ["Дикция", "Словарь"],
  },
  {
    emoji: "🐸",
    title: "Прыгающая лягушка",
    desc: "Чистоговорки и скороговорки для быстрой речи",
    age: "6–9 лет",
    color: "#9B5DE5",
    bg: "#F5EEFF",
    tags: ["Скороговорки", "Темп"],
  },
  {
    emoji: "🌈",
    title: "Радуга звуков",
    desc: "Различай и воспроизводи похожие звуки-двойники",
    age: "5–8 лет",
    color: "#FF9F1C",
    bg: "#FFF5E8",
    tags: ["Фонематика", "Различение"],
  },
];

const STATS = [
  { value: "500+", label: "Упражнений", emoji: "📚" },
  { value: "12 000+", label: "Детей занимаются", emoji: "👧" },
  { value: "98%", label: "Родителей довольны", emoji: "⭐" },
  { value: "3–12", label: "Возраст детей", emoji: "🎂" },
];

const FloatingEmoji = ({ emoji, className }: { emoji: string; className?: string }) => (
  <div className={`absolute text-4xl select-none pointer-events-none ${className}`}>{emoji}</div>
);

interface HeroSectionProps {
  visible: boolean;
  scrollTo: (id: string) => void;
}

export default function HeroSection({ visible, scrollTo }: HeroSectionProps) {
  const navigate = useNavigate();
  return (
    <>
      {/* HERO */}
      <section id="home" className="relative min-h-screen pt-20 flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 blob-shape bg-pink-200 opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-64 h-64 blob-shape-2 bg-purple-200 opacity-30 animate-float2" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-yellow-200 opacity-20 animate-float3" />
          <div className="absolute rounded-full opacity-20 pointer-events-none w-20 h-20 bg-[#FF6B9D]" style={{ top: "15%", right: "20%" }} />
          <div className="absolute rounded-full opacity-20 pointer-events-none w-12 h-12 bg-[#4D96FF]" style={{ bottom: "25%", left: "15%" }} />
          <div className="absolute rounded-full opacity-20 pointer-events-none w-10 h-10 bg-[#6BCB77]" style={{ top: "40%", right: "5%" }} />
        </div>

        <FloatingEmoji emoji="⭐" className="top-32 right-[25%] animate-float delay-200" />
        <FloatingEmoji emoji="🌟" className="bottom-40 left-[20%] animate-float2 delay-500" />
        <FloatingEmoji emoji="✨" className="top-48 left-[30%] animate-float3" />

        <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-full px-4 py-2 text-sm font-bold mb-6 animate-bounce-slow">
              🎉 Новые игры каждые 2 недели!
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-[#9B5DE5]">Учим</span>{" "}
              <span className="text-[#FF6B9D]">говорить</span>
              <br />
              <span className="text-[#FFD93D] drop-shadow-sm">играя! 🎮</span>
            </h1>
            <p className="text-xl text-gray-600 font-semibold leading-relaxed mb-8 max-w-lg">
              Логопедические игры для детей 3–12 лет. Весело, эффективно и без скуки — ребёнок сам захочет заниматься!
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/games")}
                className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-black text-lg px-8 py-4 rounded-3xl shadow-2xl hover:scale-105 transition-all animate-pulse-ring"
              >
                Начать играть бесплатно 🚀
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="bg-white border-2 border-[#9B5DE5] text-[#9B5DE5] font-black text-lg px-8 py-4 rounded-3xl hover:bg-purple-50 transition-all"
              >
                Узнать больше →
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["😊", "🧒", "👦", "👧"].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-2 border-white flex items-center justify-center text-lg">
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-black text-gray-800">12 000+ детей</div>
                <div className="text-sm text-gray-500 font-semibold">уже занимаются с нами</div>
              </div>
            </div>
          </div>

          <div className={`relative transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D]/30 to-[#9B5DE5]/20 rounded-[3rem] blur-3xl" />
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-float">
                <img src={HERO_IMAGE} alt="Дети играют" className="w-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 bg-[#FFD93D] rounded-3xl p-4 shadow-xl animate-wiggle border-4 border-white">
                <div className="text-3xl">🏆</div>
                <div className="font-black text-gray-800 text-sm">ТОП игра!</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-3xl p-4 shadow-xl animate-float2 border-2 border-pink-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-black text-gray-800">4.9/5</div>
                    <div className="text-xs text-gray-500 font-semibold">Рейтинг</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gradient-to-r from-[#9B5DE5] to-[#FF6B9D] relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-4xl mb-2 animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>
                  {stat.emoji}
                </div>
                <div className="text-4xl lg:text-5xl font-black mb-1">{stat.value}</div>
                <div className="text-white/80 font-semibold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="py-24 px-4 relative">
        <FloatingEmoji emoji="🎲" className="top-10 right-10 animate-float opacity-30" />
        <FloatingEmoji emoji="🌟" className="bottom-10 left-10 animate-float2 opacity-30" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-[#FF6B9D] rounded-full px-4 py-2 text-sm font-bold mb-4">
              🎮 Наши игры
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
              Выбери своё упражнение
            </h2>
            <p className="text-xl text-gray-500 font-semibold max-w-2xl mx-auto">
              Каждая игра разработана логопедами и проверена на тысячах детей
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game, i) => (
              <div
                key={i}
                onClick={() => navigate("/games")}
                className="game-card rounded-3xl p-6 border-2 cursor-pointer"
                style={{ background: game.bg, borderColor: game.color + "60" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl animate-bounce-slow" style={{ animationDelay: `${i * 0.15}s` }}>
                    {game.emoji}
                  </div>
                  <span className="bg-white/80 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor: game.color + "40" }}>
                    {game.age}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{game.title}</h3>
                <p className="text-gray-600 font-semibold text-sm leading-relaxed mb-4">{game.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ background: game.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="w-full py-3 rounded-2xl font-black text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)` }}
                >
                  Играть →
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/games")}
              className="bg-gradient-to-r from-[#4D96FF] to-[#9B5DE5] text-white font-black text-lg px-10 py-4 rounded-3xl shadow-xl hover:scale-105 transition-all"
            >
              Смотреть все игры →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}