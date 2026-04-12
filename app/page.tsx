"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Sun,
  Moon,
  Send,
  Users,
  UserCheck,
  LogOut,
  UserCircle2,
  Sparkles,
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const [nom, setNom] = useState("");
  const [nomValide, setNomValide] = useState("");
  const [dark, setDark] = useState(true);
  const router = useRouter();

  const { user, isLoaded } = useUser();

  const heure = new Date().getHours();
  const salutation = heure >= 12 ? "Bonsoir" : "Bonjour";
  const isNight = heure >= 12;

  const handleSubmit = () => {
    if (nom.trim() === "") {
      toast.error("Veuillez entrer votre nom !");
      return;
    }
    toast.success(`Bienvenue, ${nom} !`);
    setNomValide(nom);
  };

  const allerAuDashboard = () => {
    router.push("/dashboard");
  };

  // ── Styles dynamiques ───────────────────────────────────────────────────
  const bg = dark
    ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
    : "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50";

  const card = dark
    ? "bg-white/5 backdrop-blur-xl border border-white/10"
    : "bg-white/80 backdrop-blur-xl border border-amber-200/60 shadow-xl";

  const titleColor = dark
    ? "bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent";

  const inputClass = dark
    ? "w-full bg-slate-800 text-white placeholder-slate-500 border-2 border-slate-600 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-3 text-base transition-colors duration-200"
    : "w-full bg-white text-slate-900 placeholder-slate-400 border-2 border-amber-300 focus:border-orange-500 focus:outline-none rounded-xl px-4 py-3 text-base transition-colors duration-200";

  const labelColor = dark ? "text-amber-400" : "text-orange-500";
  const subText = dark ? "text-slate-300" : "text-slate-600";

  // ── Écran de chargement Clerk ───────────────────────────────────────────
  if (!isLoaded) {
    return (
      <main className={`${bg} min-h-screen flex items-center justify-center`}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-amber-400 text-xl font-bold flex items-center gap-3"
        >
          <Sparkles size={24} className="animate-pulse" />
          Chargement...
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className={`
        ${bg} min-h-screen transition-colors duration-500
        flex flex-col items-center justify-start
        px-4 pt-16 pb-12 gap-10 relative overflow-x-hidden
      `}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: dark
            ? {
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #334155",
              }
            : {
                background: "#fff",
                color: "#1e293b",
                border: "1px solid #fcd34d",
              },
        }}
      />

      {/* Décors */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Boutons haut à droite */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDark(!dark)}
          className={`p-3 rounded-full border transition-colors duration-300 ${
            dark
              ? "bg-white/10 border-white/20 text-amber-400 hover:bg-white/20"
              : "bg-white border-amber-300 text-orange-500 hover:bg-amber-50 shadow-md"
          }`}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        <SignOutButton>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full border bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-300"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </motion.button>
        </SignOutButton>
      </div>

      {/* Salutation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-4"
      >
        <motion.div
          animate={{ rotate: isNight ? 0 : [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          {isNight ? (
            <Moon size={56} className="text-indigo-300" />
          ) : (
            <Sun size={56} className="text-amber-400" />
          )}
        </motion.div>

        <h1
          className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tight ${titleColor}`}
        >
          {salutation}
        </h1>
      </motion.div>

      {/* Formulaire ou bienvenue */}
      <AnimatePresence mode="wait">
        {/* ÉTAPE 1 — Saisie du nom */}
        {!nomValide ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-md ${card} rounded-2xl p-8 flex flex-col gap-5`}
          >
            {/* Illustration Lucide à la place de l'avatar */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className={`p-4 rounded-2xl ${
                  dark
                    ? "bg-amber-400/10 border border-amber-400/20"
                    : "bg-amber-100 border border-amber-300"
                }`}
              >
                <UserCircle2 size={48} className="text-amber-400" />
              </motion.div>
            </div>

            <p className={`${subText} text-lg font-medium text-center`}>
              Comment vous appelez-vous ?
            </p>

            <div className="flex flex-col gap-1">
              <label
                className={`${labelColor} text-xs font-bold tracking-widest uppercase`}
              >
                Votre nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Ex : Jean Dupont"
                className={inputClass}
                autoFocus
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="w-full bg-linear-to-r from-amber-400 to-yellow-300 text-slate-900 font-extrabold py-3 rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Envoyer
            </motion.button>
          </motion.div>
        ) : (
          /* ÉTAPE 2 — Message de bienvenue */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full max-w-lg ${card} rounded-2xl p-8 flex flex-col items-center gap-6 text-center`}
          >
            {/* Illustration de bienvenue animée */}
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className={`p-5 rounded-full ${
                  dark
                    ? "bg-amber-400/10 border border-amber-400/20"
                    : "bg-amber-100 border border-amber-300"
                }`}
              >
                <UserCheck size={52} className="text-amber-400" />
              </motion.div>

              {/* Étoile décorative en haut à droite */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles size={22} className="text-yellow-400" />
              </motion.div>
            </div>

            {/* Salutation avec nom saisi + compte Clerk */}
            <div className="flex flex-col gap-2">
              <h2
                className={`text-2xl sm:text-3xl font-extrabold ${dark ? "text-white" : "text-slate-800"}`}
              >
                {salutation},{" "}
                <span className="text-amber-500">{nomValide}</span> !
              </h2>

              {/* Nom du compte Clerk en petit */}
              {user?.firstName && (
                <p
                  className={`text-sm ${subText} flex items-center justify-center gap-1`}
                >
                  <UserCircle2 size={14} className={labelColor} />
                  Connecté en tant que{" "}
                  <span className={`font-semibold ${labelColor}`}>
                    {user.firstName} {user.lastName ?? ""}
                  </span>
                </p>
              )}
            </div>

            <p className={`${subText} text-base leading-relaxed`}>
              Bienvenue sur votre espace de gestion des employés.
              <br />
              Tout est prêt pour vous !
            </p>

            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 30px rgba(251,191,36,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={allerAuDashboard}
              className="w-full bg-linear-to-r from-amber-400 to-yellow-300 text-slate-900 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Users size={20} />
              Gérer mes employés
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
