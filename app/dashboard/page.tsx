"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import {
  Sun,
  Moon,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Users,
  Mail,
  Briefcase,
  User,
  Hash,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

type Employe = {
  id: number;
  nom: string;
  prenoms: string;
  email: string;
  poste: string;
};

const formVide = { nom: "", prenoms: "", email: "", poste: "" };
const ITEMS_PAR_PAGE = 5;

const fields = [
  { label: "Nom", key: "nom", placeholder: "Ex : Dupont", icon: User },
  {
    label: "Prénoms",
    key: "prenoms",
    placeholder: "Ex : Jean Pierre",
    icon: User,
  },
  {
    label: "Email",
    key: "email",
    placeholder: "Ex : jean@email.com",
    icon: Mail,
  },
  {
    label: "Poste",
    key: "poste",
    placeholder: "Ex : Développeur",
    icon: Briefcase,
  },
];

export default function Dashboard() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [form, setForm] = useState(formVide);
  const [employeEnModif, setEmployeEnModif] = useState<Employe | null>(null);
  const [chargement, setChargement] = useState(true);
  const [dark, setDark] = useState(true);
  const [pageCourante, setPageCourante] = useState(1);

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // eslint-disable-next-line react-hooks/immutability
      chargerEmployes();
    }
  }, [isLoaded, isSignedIn]);

  // ── Pagination ──────────────────────────────────────────────────────────
  const totalPages = Math.ceil(employes.length / ITEMS_PAR_PAGE);
  const debut = (pageCourante - 1) * ITEMS_PAR_PAGE;
  const employesDuPage = employes.slice(debut, debut + ITEMS_PAR_PAGE);

  const chargerEmployes = () => {
    setChargement(true);
    fetch("/api/emploies")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setEmployes(data);
        setPageCourante(1); // ✅ reset à la page 1 après chargement
        toast.success("Liste chargée !");
      })
      .catch(() => {
        toast.error("Erreur de chargement");
      })
      .finally(() => {
        setChargement(false);
      });
  };

  const ajouterEmploye = async () => {
    const id = toast.loading("Ajout en cours...");
    const res = await fetch("/api/emploies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("✅ Employé ajouté !", { id });
      setForm(formVide);
      chargerEmployes();
    } else {
      const err = await res.json();
      toast.error(`❌ ${err.error}`, { id });
    }
  };

  const preparerModification = (emp: Employe) => {
    setEmployeEnModif(emp);
    setForm({
      nom: emp.nom,
      prenoms: emp.prenoms,
      email: emp.email,
      poste: emp.poste,
    });
    toast("Mode modification activé", { icon: "✏️" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const modifierEmploye = async () => {
    if (!employeEnModif) return;
    const id = toast.loading("Modification en cours...");
    const res = await fetch("/api/emploies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: employeEnModif.id, ...form }),
    });
    if (res.ok) {
      toast.success("✅ Employé modifié !", { id });
      setEmployeEnModif(null);
      setForm(formVide);
      chargerEmployes();
    } else {
      const err = await res.json();
      toast.error(`❌ ${err.error}`, { id });
    }
  };

  const supprimerEmploye = async (empId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    const id = toast.loading("Suppression...");
    const res = await fetch("/api/emploies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: empId }),
    });
    if (res.ok) {
      toast.success("🗑️ Employé supprimé !", { id });
      // ✅ Si on supprime le dernier élément d'une page, on recule d'une page
      if (employesDuPage.length === 1 && pageCourante > 1) {
        setPageCourante(pageCourante - 1);
      }
      chargerEmployes();
    } else {
      const err = await res.json();
      toast.error(`❌ ${err.error}`, { id });
    }
  };

  // ── Styles dynamiques ───────────────────────────────────────────────────
  const bg = dark
    ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
    : "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50";

  const card = dark
    ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
    : "bg-white/80 backdrop-blur-xl border border-amber-200/60 shadow-xl";

  const titleColor = dark
    ? "bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent";

  const inputClass = dark
    ? "w-full bg-slate-800 text-white placeholder-slate-500 border-2 border-slate-600 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors duration-200"
    : "w-full bg-white text-slate-900 placeholder-slate-400 border-2 border-amber-300 focus:border-orange-500 focus:outline-none rounded-xl px-4 py-3 text-sm transition-colors duration-200";

  const labelColor = dark ? "text-amber-400" : "text-orange-500";
  const textPrimary = dark ? "text-white" : "text-slate-800";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const rowHover = dark ? "hover:bg-white/5" : "hover:bg-amber-50/50";
  const divider = dark ? "border-white/5" : "border-amber-100";
  const cancelBtn = dark
    ? "bg-slate-700 hover:bg-slate-600 text-white"
    : "bg-slate-200 hover:bg-slate-300 text-slate-700";
  const refreshBtn = dark
    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
    : "bg-slate-200 hover:bg-slate-300 text-slate-600";

  if (!isLoaded) {
    return (
      <main className={`${bg} min-h-screen flex items-center justify-center`}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-amber-400 text-xl font-bold flex items-center gap-2"
        >
          <RefreshCw size={20} className="animate-spin" />
          Chargement...
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className={`${bg} min-h-screen px-4 py-10 sm:px-8 relative transition-colors duration-500`}
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
      <div className="fixed top-10 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

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

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex items-center gap-3"
      >
        <Users size={40} className="text-amber-400 shrink-0" />
        <div>
          <h1 className={`text-4xl sm:text-5xl font-black ${titleColor}`}>
            Gestion des Employés
          </h1>
          <p
            className={`${textSecondary} mt-1 text-sm flex items-center gap-1`}
          >
            <Hash size={14} />
            {employes.length} employé{employes.length > 1 ? "s" : ""} enregistré
            {employes.length > 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className={`${card} rounded-2xl p-6 sm:p-8 mb-8`}
      >
        <h2
          className={`text-lg sm:text-xl font-bold ${labelColor} mb-6 flex items-center gap-2`}
        >
          {employeEnModif ? (
            <>
              <Pencil size={20} /> Modifier l&apos;employé
            </>
          ) : (
            <>
              <Plus size={20} /> Ajouter un employé
            </>
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {fields.map(({ label, key, placeholder, icon: Icon }) => (
            <div key={key} className="flex flex-col gap-1">
              <label
                className={`${labelColor} text-xs font-bold tracking-widest uppercase flex items-center gap-1`}
              >
                <Icon size={13} /> {label}
              </label>
              <input
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={employeEnModif ? modifierEmploye : ajouterEmploye}
            className="flex-1 bg-linear-to-r from-amber-400 to-yellow-300 text-slate-900 font-extrabold py-3 rounded-xl hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {employeEnModif ? (
              <>
                <Save size={18} /> Enregistrer
              </>
            ) : (
              <>
                <Plus size={18} /> Ajouter
              </>
            )}
          </motion.button>

          {employeEnModif && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEmployeEnModif(null);
                setForm(formVide);
              }}
              className={`flex-1 sm:flex-none font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 ${cancelBtn}`}
            >
              <X size={18} /> Annuler
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={chargerEmployes}
            className={`p-3 rounded-xl flex items-center justify-center transition-colors duration-200 ${refreshBtn}`}
            title="Rafraîchir la liste"
          >
            <RefreshCw size={18} className={chargement ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </motion.div>

      {/* Liste des employés */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`${card} rounded-2xl overflow-hidden`}
      >
        {chargement ? (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`py-16 text-center ${textSecondary} text-lg flex items-center justify-center gap-2`}
          >
            <RefreshCw size={20} className="animate-spin" /> Chargement...
          </motion.div>
        ) : employes.length === 0 ? (
          <div
            className={`py-16 text-center ${textSecondary} flex flex-col items-center gap-3`}
          >
            <Users size={40} className="opacity-30" />
            Aucun employé enregistré.
          </div>
        ) : (
          <>
            {/* ── Tableau — md+ ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-linear-to-r from-amber-400 to-yellow-300">
                    {[
                      { label: "N°", icon: Hash },
                      { label: "Nom", icon: User },
                      { label: "Prénoms", icon: User },
                      { label: "Email", icon: Mail },
                      { label: "Poste", icon: Briefcase },
                      { label: "Actions", icon: null },
                    ].map(({ label, icon: Icon }) => (
                      <th
                        key={label}
                        className="px-5 py-4 font-bold text-sm uppercase tracking-wide text-slate-900"
                      >
                        <span className="flex items-center gap-1">
                          {Icon && <Icon size={14} />} {label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {employesDuPage.map((emp, i) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border-t ${divider} ${rowHover} transition-colors duration-150`}
                      >
                        {/* ✅ Numérotation continue selon la page */}
                        <td className="px-5 py-4 text-amber-400 font-black">
                          {debut + i + 1}
                        </td>
                        <td
                          className={`px-5 py-4 font-semibold ${textPrimary}`}
                        >
                          {emp.nom}
                        </td>
                        <td className={`px-5 py-4 ${textSecondary}`}>
                          {emp.prenoms}
                        </td>
                        <td className="px-5 py-4 text-sky-400 text-sm">
                          <span className="flex items-center gap-1">
                            <Mail size={13} /> {emp.email}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-amber-400/15 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <Briefcase size={11} /> {emp.poste}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => preparerModification(emp)}
                              className="bg-amber-400/10 hover:bg-amber-400/25 text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Pencil size={13} /> Modifier
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => supprimerEmploye(emp.id)}
                              className="bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={13} /> Supprimer
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ── Cartes — mobile ── */}
            <div className={`md:hidden flex flex-col divide-y ${divider}`}>
              <AnimatePresence>
                {employesDuPage.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-black text-lg flex items-center gap-1">
                        <Hash size={16} /> {debut + i + 1}
                      </span>
                      <span className="bg-amber-400/15 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <Briefcase size={11} /> {emp.poste}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`font-bold text-base flex items-center gap-1 ${textPrimary}`}
                      >
                        <User size={15} className="text-amber-400 shrink-0" />
                        {emp.nom} {emp.prenoms}
                      </p>
                      <p className="text-sky-400 text-sm mt-1 flex items-center gap-1">
                        <Mail size={13} /> {emp.email}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => preparerModification(emp)}
                        className="flex-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Pencil size={13} /> Modifier
                      </button>
                      <button
                        onClick={() => supprimerEmploye(emp.id)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div
                className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}
              >
                {/* Info pages */}
                <p className={`text-sm ${textSecondary}`}>
                  Page{" "}
                  <span className="text-amber-400 font-bold">
                    {pageCourante}
                  </span>{" "}
                  sur{" "}
                  <span className="text-amber-400 font-bold">{totalPages}</span>{" "}
                  — {employes.length} employé{employes.length > 1 ? "s" : ""}
                </p>

                {/* Boutons navigation */}
                <div className="flex items-center gap-2">
                  {/* Précédent */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPageCourante(pageCourante - 1)}
                    disabled={pageCourante === 1}
                    className={`p-2 rounded-lg border transition-colors duration-200 ${
                      pageCourante === 1
                        ? "opacity-30 cursor-not-allowed border-white/10 text-slate-500"
                        : dark
                          ? "border-white/20 text-amber-400 hover:bg-white/10"
                          : "border-amber-300 text-orange-500 hover:bg-amber-50"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </motion.button>

                  {/* Numéros de pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPageCourante(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors duration-200 ${
                          page === pageCourante
                            ? "bg-linear-to-r from-amber-400 to-yellow-300 text-slate-900"
                            : dark
                              ? "border border-white/20 text-slate-400 hover:bg-white/10"
                              : "border border-amber-200 text-slate-500 hover:bg-amber-50"
                        }`}
                      >
                        {page}
                      </motion.button>
                    ),
                  )}

                  {/* Suivant */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPageCourante(pageCourante + 1)}
                    disabled={pageCourante === totalPages}
                    className={`p-2 rounded-lg border transition-colors duration-200 ${
                      pageCourante === totalPages
                        ? "opacity-30 cursor-not-allowed border-white/10 text-slate-500"
                        : dark
                          ? "border-white/20 text-amber-400 hover:bg-white/10"
                          : "border-amber-300 text-orange-500 hover:bg-amber-50"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
}
