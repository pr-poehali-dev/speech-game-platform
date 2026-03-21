import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "games", label: "Игры" },
  { id: "about", label: "О проекте" },
  { id: "logopeds", label: "Логопедам" },
  { id: "parents", label: "Родителям" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "Контакты" },
];

interface NavBarProps {
  activeSection: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollTo: (id: string) => void;
}

export default function NavBar({ activeSection, menuOpen, setMenuOpen, scrollTo }: NavBarProps) {
  return (
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
  );
}
