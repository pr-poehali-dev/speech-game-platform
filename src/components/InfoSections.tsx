const GAMES_IMAGE = "https://cdn.poehali.dev/projects/45a7bdc2-bd26-485c-aba5-63edefe5f89d/files/3e769578-5797-4f57-ae9f-a6706624fe54.jpg";

export default function InfoSections() {
  return (
    <>
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
                  { name: "Татьяна П.", city: "Казань", text: "Отличная альтернатива занятиям у логопеда. Доступно, понятно и дети в восторге от мультяшного дизайна!", emoji: "🥰" },
                  { name: "Сергей К.", city: "Екатеринбург", text: "Дочка занимается 3 месяца — результат заметен. Главное, что она не считает это скучным уроком!", emoji: "😊" },
                ].map((review, i) => (
                  <div key={i} className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center text-xl">
                        {review.emoji}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-sm">{review.name}</div>
                        <div className="text-xs text-gray-500 font-semibold">{review.city}</div>
                      </div>
                      <div className="ml-auto text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                    </div>
                    <p className="text-gray-600 text-sm font-semibold leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
