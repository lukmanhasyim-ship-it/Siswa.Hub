export const bottomNavStyles = {
  nav: [
    'fixed inset-x-0 bottom-0 z-[70] flex border-t border-slate-100 bg-white/95',
    'px-1.5 pt-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.3)]',
    'backdrop-blur-md print:hidden md:hidden',
  ].join(' '),
  item: [
    'relative flex min-h-[62px] min-w-0 flex-1 flex-col items-center justify-center gap-1.5',
    'rounded-xl px-0.5 outline-none transition-colors motion-reduce:transition-none',
    'active:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500',
  ].join(' '),
  active: 'text-emerald-700',
  inactive: 'text-slate-500',
  icon: 'h-6 w-6 shrink-0',
  label: 'w-full truncate text-center text-[11px] font-semibold leading-tight',
  indicator: 'absolute top-1.5 h-1 w-8 rounded-full bg-emerald-600',
};
