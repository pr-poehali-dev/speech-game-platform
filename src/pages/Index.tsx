import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import InfoSections from "@/components/InfoSections";
import FaqContacts from "@/components/FaqContacts";

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
      <NavBar
        activeSection={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollTo={scrollTo}
      />
      <HeroSection visible={visible} scrollTo={scrollTo} />
      <InfoSections />
      <FaqContacts openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </div>
  );
}
