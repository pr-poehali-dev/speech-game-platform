import func2url from "../../../backend/func2url.json";
import { GameMeta } from "./games.types";

interface Props {
  game: GameMeta;
  onClose: () => void;
}

export default function GamePlayer({ game, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{game.emoji}</span>
          <h2 className="font-black text-gray-800 text-lg">{game.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 font-black text-lg transition-all"
        >
          ✕
        </button>
      </div>
      <iframe
        src={`${func2url["get-game"]}?filename=${encodeURIComponent(game.filename)}`}
        className="w-full flex-1"
        style={{ border: "none", height: "100%" }}
        title={game.title}
      />
    </div>
  );
}
