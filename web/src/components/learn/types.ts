// ============================================================================
// NATIVA • TIPOS Y TEMAS DEL ENTORNO DE APRENDIZAJE (LEARN MODULE)
// ============================================================================

export interface LevelTheme {
  name: string;
  badgeBg: string;
  borderActive: string;
  ringActive: string;
  cardGlow: string;
  btnGradient: string;
  btnText: string;
  beaconCompleted: string;
  beaconActive: string;
  lineCompleted: string;
  accentText: string;
  dotColor: string;
  tabColor: string;
  tabActive: string;
  tabInactive: string;
  bannerBg: string;
  progressDone: string;
  progressCurrent: string;
}

export const LEVEL_THEMES: Record<string, LevelTheme> = {
  A1: {
    name: 'Fundamentos',
    badgeBg: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40 font-bold',
    borderActive: 'border-emerald-500',
    ringActive: 'ring-emerald-500/30',
    cardGlow: 'shadow-2xl shadow-emerald-500/15',
    btnGradient: 'from-emerald-500 via-teal-400 to-emerald-600',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400/40',
    beaconActive: 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/60 ring-4 ring-emerald-400/50',
    lineCompleted: 'bg-emerald-500 shadow-sm shadow-emerald-500/60',
    accentText: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    tabColor: 'text-emerald-400',
    tabActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-emerald-950/60 via-teal-950/30 to-[#0b101b] border-emerald-500/40',
    progressDone: 'bg-emerald-500 shadow-sm shadow-emerald-500/40',
    progressCurrent: 'bg-gradient-to-r from-emerald-400 to-teal-300 ring-2 ring-emerald-400/50',
  },
  A2: {
    name: 'Comunicación',
    badgeBg: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40 font-bold',
    borderActive: 'border-cyan-500',
    ringActive: 'ring-cyan-500/30',
    cardGlow: 'shadow-2xl shadow-cyan-500/15',
    btnGradient: 'from-cyan-500 via-sky-400 to-blue-600',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-400/40',
    beaconActive: 'bg-gradient-to-tr from-cyan-400 to-sky-300 text-slate-950 shadow-xl shadow-cyan-500/60 ring-4 ring-cyan-400/50',
    lineCompleted: 'bg-cyan-500 shadow-sm shadow-cyan-500/60',
    accentText: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    tabColor: 'text-cyan-400',
    tabActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-cyan-950/60 via-sky-950/30 to-[#0b101b] border-cyan-500/40',
    progressDone: 'bg-cyan-500 shadow-sm shadow-cyan-500/40',
    progressCurrent: 'bg-gradient-to-r from-cyan-400 to-sky-300 ring-2 ring-cyan-400/50',
  },
  B1: {
    name: 'Independencia',
    badgeBg: 'text-blue-300 bg-blue-500/15 border-blue-500/40 font-bold',
    borderActive: 'border-blue-500',
    ringActive: 'ring-blue-500/30',
    cardGlow: 'shadow-2xl shadow-blue-500/15',
    btnGradient: 'from-blue-500 via-indigo-500 to-blue-700',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/40',
    beaconActive: 'bg-gradient-to-tr from-blue-400 to-indigo-300 text-slate-950 shadow-xl shadow-blue-500/60 ring-4 ring-blue-400/50',
    lineCompleted: 'bg-blue-500 shadow-sm shadow-blue-500/60',
    accentText: 'text-blue-400',
    dotColor: 'bg-blue-400',
    tabColor: 'text-blue-400',
    tabActive: 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-blue-950/60 via-indigo-950/30 to-[#0b101b] border-blue-500/40',
    progressDone: 'bg-blue-500 shadow-sm shadow-blue-500/40',
    progressCurrent: 'bg-gradient-to-r from-blue-400 to-indigo-300 ring-2 ring-blue-400/50',
  },
  B2: {
    name: 'Académico',
    badgeBg: 'text-purple-300 bg-purple-500/15 border-purple-500/40 font-bold',
    borderActive: 'border-purple-500',
    ringActive: 'ring-purple-500/30',
    cardGlow: 'shadow-2xl shadow-purple-500/15',
    btnGradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-purple-500 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/40',
    beaconActive: 'bg-gradient-to-tr from-purple-400 to-violet-300 text-slate-950 shadow-xl shadow-purple-500/60 ring-4 ring-purple-400/50',
    lineCompleted: 'bg-purple-500 shadow-sm shadow-purple-500/60',
    accentText: 'text-purple-400',
    dotColor: 'bg-purple-400',
    tabColor: 'text-purple-400',
    tabActive: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-purple-950/60 via-violet-950/30 to-[#0b101b] border-purple-500/40',
    progressDone: 'bg-purple-500 shadow-sm shadow-purple-500/40',
    progressCurrent: 'bg-gradient-to-r from-purple-400 to-violet-300 ring-2 ring-purple-400/50',
  },
  C1: {
    name: 'Avanzado',
    badgeBg: 'text-rose-300 bg-rose-500/15 border-rose-500/40 font-bold',
    borderActive: 'border-rose-500',
    ringActive: 'ring-rose-500/30',
    cardGlow: 'shadow-2xl shadow-rose-500/15',
    btnGradient: 'from-rose-500 via-pink-500 to-red-600',
    btnText: 'text-white font-black',
    beaconCompleted: 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 ring-2 ring-rose-400/40',
    beaconActive: 'bg-gradient-to-tr from-rose-400 to-pink-300 text-slate-950 shadow-xl shadow-rose-500/60 ring-4 ring-rose-400/50',
    lineCompleted: 'bg-rose-500 shadow-sm shadow-rose-500/60',
    accentText: 'text-rose-400',
    dotColor: 'bg-rose-400',
    tabColor: 'text-rose-400',
    tabActive: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-rose-950/60 via-pink-950/30 to-[#0b101b] border-rose-500/40',
    progressDone: 'bg-rose-500 shadow-sm shadow-rose-500/40',
    progressCurrent: 'bg-gradient-to-r from-rose-400 to-pink-300 ring-2 ring-rose-400/50',
  },
  C2: {
    name: 'Maestría',
    badgeBg: 'text-amber-300 bg-amber-500/15 border-amber-500/40 font-bold',
    borderActive: 'border-amber-500',
    ringActive: 'ring-amber-500/30',
    cardGlow: 'shadow-2xl shadow-amber-500/15',
    btnGradient: 'from-amber-400 via-yellow-400 to-orange-500',
    btnText: 'text-slate-950 font-black',
    beaconCompleted: 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/50 ring-2 ring-amber-300/40',
    beaconActive: 'bg-gradient-to-tr from-amber-300 to-yellow-200 text-slate-950 shadow-xl shadow-amber-500/60 ring-4 ring-amber-300/50',
    lineCompleted: 'bg-amber-400 shadow-sm shadow-amber-400/60',
    accentText: 'text-amber-400',
    dotColor: 'bg-amber-400',
    tabColor: 'text-amber-400',
    tabActive: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20',
    tabInactive: 'bg-[#0d131f] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#121a2b]',
    bannerBg: 'from-amber-950/60 via-yellow-950/30 to-[#0b101b] border-amber-500/40',
    progressDone: 'bg-amber-400 shadow-sm shadow-amber-400/40',
    progressCurrent: 'bg-gradient-to-r from-amber-300 to-yellow-300 ring-2 ring-amber-300/50',
  },
};

export interface BuilderToken {
  id: string;
  text: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: string;
}
