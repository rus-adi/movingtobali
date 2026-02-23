// Shared Tailwind class tokens for a clean, modern, minimal UI.
// (Utilities only; no external UI libraries.)

export const card =
  "rounded-2xl border border-gray-200 bg-white shadow-sm";

export const cardPad = "p-6 md:p-8";

export const cardCls = `${card} ${cardPad}`;

export const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm";

export const badge = `${badgeBase} border-gray-200 bg-gray-50 text-gray-700`;
export const badgeAccent = `${badgeBase} border-blue-200 bg-blue-50 text-blue-700`;
export const badgeGood = `${badgeBase} border-emerald-200 bg-emerald-50 text-emerald-700`;
export const badgeWarn = `${badgeBase} border-amber-200 bg-amber-50 text-amber-800`;

export const pill =
  "inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50";

export const buttonBase =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 sm:w-auto";

export const buttonPrimary =
  `${buttonBase} bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-100`;

export const buttonSecondary =
  `${buttonBase} border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-100`;

export const buttonDisabled = "pointer-events-none opacity-50";

export const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100";

// Buttons should stack on mobile and sit inline on desktop.
export const btnRow = "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center";

export const grid2 = "grid grid-cols-1 gap-12 md:grid-cols-2";
export const grid3 = "grid grid-cols-1 gap-8 md:grid-cols-3";
