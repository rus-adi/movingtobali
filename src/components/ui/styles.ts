// Shared Tailwind class tokens for a clean, modern, minimal UI.
// (Utilities only; no external UI libraries.)

export const card =
  // Card containers: lift + soften on hover (subtle, modern)
  "rounded-2xl border border-gray-200 bg-white shadow-sm transform-gpu [transition-property:transform,box-shadow,border-color,background-color] duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-gray-300";

export const cardPad = "p-6 md:p-8";

export const cardCls = `${card} ${cardPad}`;

export const badgeBase =
  // Badges: modern pills with subtle depth + color transitions for interactive badges (links)
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm [transition-property:background-color,border-color,color,box-shadow,transform] duration-200 ease-out";

export const badge = `${badgeBase} border-gray-200 bg-gray-100 text-gray-700`;
export const badgeAccent = `${badgeBase} border-blue-200 bg-blue-50 text-blue-700`;
// Keep the palette minimal: reuse blue/gray tones for semantic variants.
export const badgeGood = `${badgeBase} border-blue-200 bg-blue-50 text-blue-700`;
export const badgeWarn = `${badgeBase} border-gray-200 bg-gray-100 text-gray-700`;

export const pill =
  "inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transform-gpu [transition-property:background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:border-gray-300 hover:bg-gray-50 motion-safe:hover:scale-[1.02] active:scale-[0.99]";

export const buttonBase =
  // Buttons: subtle motion + clean transitions. Stack on mobile via w-full.
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transform-gpu focus-visible:outline-none focus-visible:ring-4 sm:w-auto [transition-property:background-color,border-color,color,box-shadow,transform] duration-300 ease-in-out";

export const buttonPrimary =
  `${buttonBase} bg-blue-600 text-white hover:bg-blue-700 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg active:scale-[0.98] focus-visible:ring-blue-100`;

export const buttonSecondary =
  `${buttonBase} border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-md active:scale-[0.99] focus-visible:ring-gray-100`;

export const buttonDisabled = "pointer-events-none opacity-50";

export const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100";

// Buttons should stack on mobile and sit inline on desktop.
export const btnRow = "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center";

export const grid2 = "grid grid-cols-1 gap-12 md:grid-cols-2";
export const grid3 = "grid grid-cols-1 gap-8 md:grid-cols-3";
