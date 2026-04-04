import { useState, useEffect, useCallback } from "react";
import func2url from "../../backend/func2url.json";
import { getToken, clearToken, getMe, logout, User } from "@/lib/auth";
import { ProgressData } from "./progress/progress.types";
import ProgressAuthForm from "./progress/ProgressAuthForm";
import ProgressHeader from "./progress/ProgressHeader";
import ProgressTabs from "./progress/ProgressTabs";

export default function Progress() {
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

  if (!user) return <ProgressAuthForm onSuccess={loadUser} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressHeader
          user={user}
          data={data}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {dataLoading && (
          <div className="text-center py-16 text-gray-400 font-bold animate-pulse">Загружаем данные... 🎲</div>
        )}

        {!dataLoading && data && (
          <ProgressTabs
            activeTab={activeTab}
            data={data}
            reportText={reportText}
            copied={copied}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
}
