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

interface FaqContactsProps {
  openFaq: number | null;
  setOpenFaq: (index: number | null) => void;
}

export default function FaqContacts({ openFaq, setOpenFaq }: FaqContactsProps) {
  return (
    <>
      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#4D96FF] rounded-full px-4 py-2 text-sm font-bold mb-4">
              ❓ FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#9B5DE5] mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xl text-gray-500 font-semibold">
              Отвечаем на самые популярные вопросы
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border-2 border-purple-100 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-purple-50 transition-all"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-black text-gray-800 text-lg">{item.q}</span>
                  <span className="text-2xl flex-shrink-0 transition-transform duration-300" style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                    {openFaq === i ? "🔼" : "🔽"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <div className="h-px bg-purple-100 mb-4" />
                    <p className="text-gray-600 font-semibold leading-relaxed">{item.a}</p>
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
    </>
  );
}
