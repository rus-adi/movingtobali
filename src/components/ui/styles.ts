// Shared Tailwind class tokens for a clean, modern, minimal UI.
// (Utilities only; no external UI libraries.)

export const card =
  // Card containers: lift + soften on hover (subtle, modern)
  "rounded-2xl border border-stone-200 bg-white/95 shadow-sm transform-gpu [transition-property:transform,box-shadow,border-color,background-color] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200";

export const cardPad = "p-6 md:p-8";

export const cardCls = `${card} ${cardPad}`;

export const badgeBase =
  // Badges: modern pills with subtle depth + color transitions for interactive badges (links)
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm [transition-property:background-color,border-color,color,box-shadow,transform] duration-200 ease-out";

export const badge = `${badgeBase} border-stone-200 bg-stone-100 text-stone-700`;
export const badgeAccent = `${badgeBase} border-emerald-200 bg-emerald-50 text-emerald-700`;
// Keep the palette minimal: reuse blue/gray tones for semantic variants.
export const badgeGood = `${badgeBase} border-amber-200 bg-amber-50 text-amber-800`;
export const badgeWarn = `${badgeBase} border-stone-200 bg-stone-100 text-stone-700`;

export const pill =
  "inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm transform-gpu [transition-property:background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:border-emerald-200 hover:bg-emerald-50 motion-safe:hover:scale-[1.02] active:scale-[0.99]";

export const buttonBase =
  // Buttons: subtle motion + clean transitions. Stack on mobile via w-full.
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transform-gpu focus-visible:outline-none focus-visible:ring-4 sm:w-auto [transition-property:background-color,border-color,color,box-shadow,transform] duration-300 ease-in-out";

export const buttonPrimary =
  `${buttonBase} bg-emerald-700 text-white hover:bg-emerald-800 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg active:scale-[0.98] focus-visible:ring-emerald-100`;

export const buttonSecondary =
  `${buttonBase} border border-stone-200 bg-white text-gray-900 hover:border-emerald-200 hover:bg-emerald-50 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-md active:scale-[0.99] focus-visible:ring-stone-100`;

export const buttonDisabled = "pointer-events-none opacity-50";

export const inputBase =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100";

// Buttons should stack on mobile and sit inline on desktop.
export const btnRow = "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center";

export const grid2 = "grid grid-cols-1 gap-12 md:grid-cols-2";
export const grid3 = "grid grid-cols-1 gap-8";
