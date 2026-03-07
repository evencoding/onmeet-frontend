export const card = {
  base: "dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/30 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-purple-300/30 p-8",
  sm: "dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/40 dark:to-pink-900/20 light:bg-white light:border-2 light:border-purple-300/60 dark:border dark:border-purple-500/30 rounded-2xl p-5 dark:backdrop-blur-md light:backdrop-blur-sm",
  hover: "dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-md light:hover:shadow-purple-300/30 light:hover:border-purple-400/60 transition-all duration-300",
  interactive: "dark:hover:shadow-lg dark:hover:shadow-purple-500/30 light:hover:shadow-xl light:hover:shadow-purple-400/40 light:hover:border-purple-400/80 hover:-translate-y-1 transition-all duration-300",
} as const;

export const btn = {
  primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30",
  secondary: "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all",
  danger: "dark:bg-red-600/30 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-xl font-medium dark:hover:bg-red-600/40 light:hover:bg-red-200 transition-all",
  icon: "flex items-center justify-center gap-2",
} as const;

export const input = {
  base: "w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 light:bg-white light:shadow-md light:shadow-purple-200/20 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all",
  sm: "w-full px-3 py-2 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-lg dark:bg-white/5 light:bg-white dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-400 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/30 light:focus:ring-purple-300/40 transition-all text-sm",
} as const;

export const text = {
  primary: "dark:text-white light:text-purple-900",
  secondary: "dark:text-white/70 light:text-purple-700",
  muted: "dark:text-white/50 light:text-purple-600",
  accent: "dark:text-purple-400 light:text-purple-600",
  heading: "dark:text-white/90 light:text-purple-900",
} as const;

export const badge = {
  purple: "dark:bg-purple-500/30 dark:text-purple-300 light:bg-purple-100/70 light:text-purple-800 px-2.5 py-1 text-xs font-semibold rounded-full",
  green: "dark:bg-green-500/30 dark:text-green-300 light:bg-green-100/70 light:text-green-800 px-2.5 py-1 text-xs font-semibold rounded-full",
  red: "dark:bg-red-500/30 dark:text-red-300 light:bg-red-100/70 light:text-red-800 px-2.5 py-1 text-xs font-semibold rounded-full",
  yellow: "dark:bg-yellow-500/30 dark:text-yellow-300 light:bg-yellow-100/70 light:text-yellow-800 px-2.5 py-1 text-xs font-semibold rounded-full",
  blue: "dark:bg-blue-500/30 dark:text-blue-300 light:bg-blue-100/70 light:text-blue-800 px-2.5 py-1 text-xs font-semibold rounded-full",
} as const;

export const border = {
  base: "dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70",
  subtle: "dark:border-purple-500/20 light:border-purple-300/40",
  divider: "border-t dark:border-purple-500/20 light:border-purple-300/40",
} as const;

export const gradient = {
  accent: "bg-gradient-to-r from-purple-500 to-pink-500",
  accentBtn: "bg-gradient-to-r from-purple-600 to-pink-600",
  page: "dark:bg-gradient-to-br dark:from-purple-900/20 dark:via-black dark:to-pink-900/10 light:bg-gradient-to-br light:from-purple-50 light:via-white light:to-pink-50",
} as const;

export const error = {
  container: "p-4 dark:bg-red-500/20 dark:border dark:border-red-500/50 light:bg-red-50 light:border-2 light:border-red-300/60 rounded-lg",
  text: "text-sm dark:text-red-300 light:text-red-700",
} as const;

export const avatar = {
  border: "dark:border-purple-500/30 light:border-purple-300/50",
} as const;
