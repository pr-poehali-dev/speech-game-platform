import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/45a7bdc2-bd26-485c-aba5-63edefe5f89d/files/fe0403e8-cddb-42a9-9296-38e3722a62d2.jpg";
const GAMES_IMAGE = "https://cdn.poehali.dev/projects/45a7bdc2-bd26-485c-aba5-63edefe5f89d/files/3e769578-5797-4f57-ae9f-a6706624fe54.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "games", label: "Игры" },
  { id: "about", label: "О проекте" },
  { id: "logopeds", label: "Логопедам" },
  { id: "parents", label: "Родителям" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "Контакты" },
];

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

const FAQ_ITEMS = [
  {
    q: "Подходит ли сайт для самостоятельных занятий дома?",
    a: "Да! Все игры сопровождаются подробными инструкциями и подсказками для родителей. Вы сможете заниматься с ребёнком без специальных знаний.",
  },
  {
    q: "С какого возраста можно начинать?",
    a: "Игры разработаны для детей от 3 до 12 лет. У каждой игры указана рекомендуемая возрастная группа, чтобы вы легко нашли подходящее упражнение.",
  },
  {
    q: "Могут ли логопеды использовать материалы в своей работе?",
    a: "Конечно! Специальный раздел «Для логопедов» содержит методические материалы, конспекты занятий и карточки, которые можно использовать на приёме.",
  },
  {
    q: "Нужно ли платить за игры?",
    a: "Большинство игр бесплатны. Некоторые расширенные наборы и профессиональные материалы доступны по подписке.",
  },
  {
    q: "Как часто добавляются новые игры?",
    a: "Мы добавляем новые упражнения каждые 2 недели. Подпишитесь на рассылку, чтобы первыми узнавать о новинках.",
  },
];

const FloatingEmoji = ({ emoji, className }: { emoji: string; className?: string }) => (
  <div className={`absolute text-4xl select-none pointer-events-none ${className}`}>{emoji}</div>
);

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="font-nunito min-h-screen bubble-bg overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
              🗣️
            </div>
            <div>
              <span className="font-black text-xl text-[#9B5DE5]">Лого</span>
              <span className="font-black text-xl text-[#FF6B9D]">Дети</span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeSection === item.id
                    ? "text-[#FF6B9D] bg-pink-50"
                    : "text-gray-600 hover:text-[#9B5DE5] hover:bg-purple-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => scrollTo("games")}
              className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg hover:scale-105 transition-transform text-sm"
            >
              Играть бесплатно 🎮
            </button>
          </div>

          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF6B9D]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-pink-50 hover:text-[#FF6B9D] transition-all"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("games")}
              className="mt-2 bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-bold px-5 py-3 rounded-2xl shadow-lg text-center"
            >
              Играть бесплатно 🎮
            </button>
          </div>
        )}
      </nav>

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
              <span>🎉</span> Более 12 000 детей уже занимаются!
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-[#9B5DE5]">Речь</span>{" "}
              <span className="text-[#FF6B9D]">в игре —</span>
              <br />
              <span className="bg-gradient-to-r from-[#6BCB77] to-[#4D96FF] bg-clip-text text-transparent">легко и весело!</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg font-semibold">
              Логопедические игры для детей от 3 до 12 лет. Тренируем произношение, артикуляцию и дикцию — играючи!
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("games")}
                className="bg-gradient-to-r from-[#FF6B9D] to-[#9B5DE5] text-white font-black text-lg px-8 py-4 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                🎮 Начать играть
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="bg-white text-[#9B5DE5] font-black text-lg px-8 py-4 rounded-3xl border-2 border-purple-200 hover:border-[#9B5DE5] hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                Узнать больше →
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10">
              {["Бесплатно", "Без регистрации", "Для всех устройств"].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-green-600" />
                  </div>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D]/30 to-[#9B5DE5]/30 rounded-[3rem] blur-3xl scale-110" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-float">
                <img src={HERO_IMAGE} alt="Логопедические игры" className="w-full object-cover" />
              </div>
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-float2 border-2 border-yellow-200">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="font-black text-sm text-gray-800">Топ игра</div>
                  <div className="text-xs text-gray-400">Рык льва</div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-float3 border-2 border-green-200">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-black text-sm text-gray-800">500+ игр</div>
                  <div className="text-xs text-gray-400">и упражнений</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-r from-[#9B5DE5] via-[#FF6B9D] to-[#FF9F1C] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center text-white">
              <div className="text-5xl mb-2 animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>{stat.emoji}</div>
              <div className="text-4xl font-black">{stat.value}</div>
              <div className="text-sm font-semibold opacity-80 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-bold mb-4">
            🎮 Наши игры
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
            Выбери игру и начни прямо сейчас!
          </h2>
          <p className="text-xl text-gray-500 font-semibold max-w-2xl mx-auto">
            Все упражнения разработаны с сертифицированными логопедами и адаптированы для разных возрастов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, i) => (
            <div
              key={i}
              className="game-card rounded-3xl p-6 border-2 cursor-pointer"
              style={{ background: game.bg, borderColor: game.color + "40" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-bounce-slow"
                  style={{ background: game.color, animationDelay: `${i * 0.15}s` }}
                >
                  {game.emoji}
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white shadow text-gray-600">
                  {game.age}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 font-semibold text-sm mb-4 leading-relaxed">{game.desc}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ background: game.color + "25", color: game.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className="w-full py-3 rounded-2xl font-black text-white transition-all hover:scale-105 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)` }}
              >
                Играть 🎯
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#4D96FF] to-[#9B5DE5] text-white font-black text-lg px-10 py-4 rounded-3xl shadow-xl hover:scale-105 transition-all">
            Смотреть все 500+ игр →
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute rounded-full opacity-20 pointer-events-none w-48 h-48 bg-[#9B5DE5]" style={{ top: "-50px", right: "-50px" }} />
        <div className="absolute rounded-full opacity-20 pointer-events-none w-36 h-36 bg-[#FF6B9D]" style={{ bottom: "-30px", left: "-30px" }} />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-[#9B5DE5] rounded-full px-4 py-2 text-sm font-bold mb-6">
              🌟 О проекте
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-6 leading-tight">
              Почему <span className="text-[#FF6B9D]">ЛогоДети</span> — это работает?
            </h2>
            <p className="text-lg text-gray-600 font-semibold leading-relaxed mb-6">
              Мы создали платформу, где логопедические упражнения превращаются в увлекательные игры. Дети занимаются с удовольствием, а результат виден уже через несколько недель.
            </p>
            <div className="space-y-4">
              {[
                { icon: "🎓", title: "Методика проверена", desc: "Все материалы разработаны совместно с логопедами высшей категории" },
                { icon: "🎨", title: "Яркий дизайн", desc: "Красочные иллюстрации и анимации удерживают внимание детей" },
                { icon: "📊", title: "Отслеживание прогресса", desc: "Следите за успехами ребёнка в личном кабинете" },
                { icon: "🏠", title: "Дома как с логопедом", desc: "Подробные инструкции позволяют заниматься самостоятельно" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-black text-gray-800">{item.title}</div>
                    <div className="text-sm text-gray-500 font-semibold">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/30 to-[#FF9F1C]/20 rounded-[3rem] blur-2xl" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-float2">
              <img src={GAMES_IMAGE} alt="Игры для детей" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* FOR LOGOPEDS */}
      <section id="logopeds" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-bold mb-4">
              👩‍⚕️ Для логопедов
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
              Инструменты для профессионалов
            </h2>
            <p className="text-xl text-gray-500 font-semibold max-w-2xl mx-auto">
              Готовые материалы, которые экономят время на подготовку занятий
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "📋", title: "Конспекты занятий", desc: "Готовые планы занятий по всем разделам логопедии с указанием целей и задач", color: "#6BCB77", bg: "#EDFFF0" },
              { emoji: "🃏", title: "Карточки и пособия", desc: "Печатные и цифровые карточки для индивидуальной и групповой работы", color: "#4D96FF", bg: "#EEF5FF" },
              { emoji: "📈", title: "Мониторинг прогресса", desc: "Таблицы и графики для отслеживания динамики развития каждого ребёнка", color: "#9B5DE5", bg: "#F5EEFF" },
              { emoji: "🔔", title: "Домашние задания", desc: "Отправляйте родителям задания прямо через платформу одной кнопкой", color: "#FF6B9D", bg: "#FFF0F5" },
              { emoji: "📚", title: "Методическая база", desc: "Статьи, видео-уроки и вебинары от ведущих специалистов России", color: "#FF9F1C", bg: "#FFF5E8" },
              { emoji: "🤝", title: "Сообщество", desc: "Закрытый чат для логопедов — делитесь опытом и получайте поддержку", color: "#FFD93D", bg: "#FFF9E3" },
            ].map((card, i) => (
              <div
                key={i}
                className="game-card rounded-3xl p-6 border-2"
                style={{ background: card.bg, borderColor: card.color + "40" }}
              >
                <div className="text-4xl mb-4 animate-bounce-slow" style={{ animationDelay: `${i * 0.1}s` }}>{card.emoji}</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600 font-semibold text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#6BCB77] to-[#4D96FF] rounded-3xl p-8 lg:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-stripes" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-3xl font-black mb-4">Профессиональная подписка</h3>
              <p className="text-lg opacity-90 mb-6 font-semibold">Получите доступ ко всем материалам и инструментам для работы</p>
              <button className="bg-white text-[#9B5DE5] font-black text-lg px-10 py-4 rounded-3xl hover:scale-105 transition-all shadow-xl">
                Попробовать бесплатно 14 дней →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOR PARENTS */}
      <section id="parents" className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 rounded-full px-4 py-2 text-sm font-bold mb-4">
              👨‍👩‍👧 Для родителей
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
              Помогите малышу говорить красиво
            </h2>
            <p className="text-xl text-gray-500 font-semibold max-w-2xl mx-auto">
              Не нужно быть логопедом — все объяснено простым языком
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { step: "1", title: "Выберите игру", desc: "Укажите возраст ребёнка и проблему — система подберёт подходящие упражнения", emoji: "🔍" },
                { step: "2", title: "Играйте вместе", desc: "Следуйте простым инструкциям. Каждое занятие — это 10–15 минут весёлой игры", emoji: "🎮" },
                { step: "3", title: "Видите результат", desc: "Отслеживайте прогресс в личном кабинете и радуйтесь успехам ребёнка", emoji: "🏆" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 bg-white rounded-3xl p-6 shadow-lg border border-orange-100 game-card">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9F1C] flex items-center justify-center text-xl font-black text-white flex-shrink-0 shadow-lg">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{item.emoji}</span>
                      <h3 className="font-black text-gray-800 text-lg">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-orange-100">
              <h3 className="text-2xl font-black text-gray-800 mb-6">Что говорят родители</h3>
              <div className="space-y-4">
                {[
                  { name: "Анна М.", city: "Москва", text: "Наш сын за месяц начал правильно произносить букву Р! Игры очень нравятся, он сам просит заниматься.", emoji: "😍" },
                  { name: "Татьяна П.", city: "Казань", text: "Отличная альтернатива занятиям у логопеда. Доступно, понятно и дети в восторге от мультяшного дизайна!", emoji: "⭐" },
                  { name: "Игорь В.", city: "Екатеринбург", text: "Занимаемся с дочкой каждый вечер по 15 минут. Уже видны улучшения в дикции. Спасибо!", emoji: "🙏" },
                ].map((review, i) => (
                  <div key={i} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-black text-gray-800">{review.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{review.city}</span>
                      </div>
                      <span className="text-2xl">{review.emoji}</span>
                    </div>
                    <p className="text-gray-600 text-sm font-semibold leading-relaxed">"{review.text}"</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-[#FFD93D] to-[#FF9F1C] text-white font-black text-lg py-4 rounded-2xl hover:scale-105 transition-all shadow-lg">
                Начать бесплатно →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-[#FF6B9D] rounded-full px-4 py-2 text-sm font-bold mb-4">
              ❓ FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
              Частые вопросы
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border-2 border-purple-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left font-black text-gray-800 hover:text-[#9B5DE5] transition-colors"
                >
                  <span className="pr-4">{item.q}</span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ background: openFaq === i ? "#FF6B9D" : "#F5F0FF", transform: openFaq === i ? "rotate(45deg)" : "none" }}
                  >
                    <Icon name="Plus" size={16} className={openFaq === i ? "text-white" : "text-[#9B5DE5]"} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 font-semibold leading-relaxed animate-fade-in-up">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-gradient-to-br from-[#9B5DE5] to-[#FF6B9D] relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes opacity-20" />
        <FloatingEmoji emoji="💬" className="top-10 right-[10%] animate-float text-5xl opacity-50" />
        <FloatingEmoji emoji="📧" className="bottom-10 left-[10%] animate-float2 text-4xl opacity-50" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="text-6xl mb-6 animate-bounce-slow">👋</div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Есть вопросы? Пишите нам!
          </h2>
          <p className="text-xl text-white/80 font-semibold mb-12 max-w-2xl mx-auto">
            Мы отвечаем в течение 24 часов и всегда рады помочь родителям и специалистам
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "📧", title: "Email", value: "hello@logodeti.ru", label: "Написать письмо" },
              { icon: "💬", title: "Telegram", value: "@logodeti_help", label: "Открыть чат" },
              { icon: "📞", title: "Телефон", value: "+7 800 123-45-67", label: "Позвонить" },
            ].map((contact, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all game-card">
                <div className="text-4xl mb-3">{contact.icon}</div>
                <div className="font-black text-white text-lg mb-1">{contact.title}</div>
                <div className="text-white/70 font-semibold text-sm mb-3">{contact.value}</div>
                <button className="w-full py-2 rounded-xl bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-all">
                  {contact.label}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-black text-white mb-6">Напишите нам</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 font-semibold focus:outline-none focus:border-white/60 transition-all"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 font-semibold focus:outline-none focus:border-white/60 transition-all"
              />
            </div>
            <textarea
              placeholder="Ваш вопрос или сообщение..."
              rows={4}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 font-semibold focus:outline-none focus:border-white/60 transition-all resize-none mb-4"
            />
            <button className="bg-white text-[#9B5DE5] font-black text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl">
              Отправить сообщение 🚀
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#9B5DE5] flex items-center justify-center text-xl">
                  🗣️
                </div>
                <div>
                  <span className="font-black text-xl text-purple-400">Лого</span>
                  <span className="font-black text-xl text-pink-400">Дети</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-semibold leading-relaxed">
                Платформа для развития речи детей через игру
              </p>
            </div>

            {[
              { title: "Игры", items: ["По звукам", "Артикуляция", "Дикция", "Фонематика"] },
              { title: "Разделы", items: ["Для логопедов", "Для родителей", "О проекте", "FAQ"] },
              { title: "Контакты", items: ["hello@logodeti.ru", "@logodeti_help", "+7 800 123-45-67"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item}>
                      <button className="text-gray-400 text-sm font-semibold hover:text-pink-400 transition-colors">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm font-semibold">
              © 2024 ЛогоДети. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              {["Политика конфиденциальности", "Условия использования"].map((link) => (
                <button key={link} className="text-gray-500 text-sm font-semibold hover:text-gray-300 transition-colors">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
