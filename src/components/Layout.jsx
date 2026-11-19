import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LogOut, Settings, User, Bell, ChevronLeft, ChevronRight,
  Search, X
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import BottomNav from './navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { NAV_GROUPS, canAccess } from '../config/navigation';
import Toast from './Toast';
import NotificationDrawer from './NotificationDrawer';
import SearchModal from './SearchModal';
import appLogo from '../assets/logo.png';
import { fetchGAS } from '../utils/gasClient';
import { getCurrentVersion } from '../utils/version';

function NavItem({ to, icon, label, collapsed, onClick }) {
  const Icon = icon;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-xl outline-none transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
          collapsed ? 'h-12 w-12 mx-auto justify-center' : 'min-h-[48px] gap-3 px-4 py-3 md:min-h-0 md:py-2.5',
          isActive
            ? `bg-emerald-50 font-bold text-emerald-700 ${
                collapsed ? 'ring-1 ring-emerald-100' : "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-emerald-600 before:content-['']"
              }`
            : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-700',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
              isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600 group-hover:scale-110'
            }`}
            aria-hidden="true"
          />
          {collapsed ? (
            <span className="sr-only">{label}</span>
          ) : (
            <span className="min-w-0 truncate text-[13px] tracking-tight">{label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const prevNotifIds = useRef(new Set());
  const moreButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasMobileOpenRef = useRef(false);

  const role = user?.role || 'Siswa';

  // Mode ringkas hanya berlaku di desktop; drawer mobile selalu memakai label penuh.
  const isCompact = isDesktop && isSidebarCollapsed;

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const handleChange = (event) => {
      setIsDesktop(event.matches);
      if (event.matches) setIsMobileOpen(false);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // Menu ditampilkan sebagai daftar datar, tanpa judul maupun pemisah grup.
  const visibleItems = useMemo(
    () => NAV_GROUPS.flatMap((group) => group.items).filter((item) => canAccess(item.roles, role)),
    [role]
  );

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const showBrowserNotification = (message) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    new Notification('SISWA.HUB', {
      body: message,
      icon: appLogo,
    });
  };

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await fetchGAS('GET_NOTIFICATIONS', { role, email: user?.email });
        if (res.status === 'success') {
          const mapped = res.data.map((n) => ({
            id: String(n.ID),
            message: String(n.Message),
            type: String(n.Type || 'info'),
            timestamp: n.Timestamp,
            isRead: String(n.Is_Read).toLowerCase() === 'true',
          }));

          // Browser Notification Logic
          if (prevNotifIds.current.size > 0) {
            // Don't notify on first load
            mapped.forEach((n) => {
              if (!prevNotifIds.current.has(n.id) && !n.isRead) {
                showBrowserNotification(n.message);
              }
            });
          }
          prevNotifIds.current = new Set(mapped.map((n) => n.id));

          setNotifications(mapped);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    }

    async function loadStudents() {
      try {
        const res = await fetchGAS('GET_ALL', { sheet: 'Master_Siswa' });
        if (res.status === 'success') {
          setStudents(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    }

    if (user) {
      loadNotifs();
      loadStudents();
      requestNotificationPermission();
    }

    // Refresh notifikasi hanya saat tab terlihat; fetchGAS sudah menghindari request identik.
    const loadIfVisible = () => {
      if (user && document.visibilityState === 'visible') loadNotifs();
    };
    const interval = setInterval(loadIfVisible, 120000);
    document.addEventListener('visibilitychange', loadIfVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', loadIfVisible);
    };
  }, [user, role]);

  // Global Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setIsNotifOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      closeButtonRef.current?.focus();
    } else if (wasMobileOpenRef.current) {
      moreButtonRef.current?.focus();
    }
    wasMobileOpenRef.current = isMobileOpen;
  }, [isMobileOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      await fetchGAS('MARK_NOTIF_READ', { id });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await fetchGAS('MARK_ALL_NOTIFS_READ', { role, email: user?.email });
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans md:flex-row">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar for Desktop and Mobile */}
      <aside
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-[100] flex h-screen flex-col border-r border-slate-100/50 bg-white transition-all duration-300 ease-in-out print:hidden ${
          isMobileOpen ? 'w-72 translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20 md:shadow-sm' : 'md:w-72 md:shadow-xl'}`}
      >
        <div
          className={`relative mb-2 flex items-center justify-between p-4 ${
            isCompact ? 'md:p-4' : 'md:p-6'
          }`}
        >
          <div
            className={`flex items-center transition-all duration-300 ${
              isCompact ? 'w-full justify-center' : 'gap-4'
            }`}
          >
            <div
              className={`rounded-2xl border border-slate-50 bg-white p-2 transition-all duration-300 ${
                isCompact ? 'shadow-sm' : ''
              }`}
            >
              <img src={appLogo} alt="Logo SMK" className="h-10 w-auto object-contain" />
            </div>
            {!isCompact && (
              <div className="flex animate-in flex-col overflow-hidden whitespace-nowrap fade-in slide-in-from-left-2 duration-300">
                <h1 className="text-xl font-black leading-none tracking-tighter text-slate-900">
                  SISWA<span className="text-emerald-700">.HUB</span>
                </h1>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  SMKS AL AZHAR SEMPU
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Tutup menu navigasi"
            className="absolute right-3 rounded-xl p-3 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            aria-label={isSidebarCollapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
            className="absolute -right-3 top-8 z-10 hidden rounded-full border border-slate-200 bg-white p-1 text-slate-400 shadow-sm transition-all hover:border-emerald-600 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:flex"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <nav
          id="sidebar-navigation"
          aria-label="Menu utama"
          className={`custom-scrollbar flex-1 space-y-1 overflow-y-auto ${
            isCompact ? 'px-2' : 'px-4'
          }`}
        >
          {visibleItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              collapsed={isCompact}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </nav>

        <div className={`mt-auto ${isCompact ? 'p-2' : 'p-6'}`}>
          <div
            className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 ${
              isCompact ? 'p-2' : 'p-4'
            }`}
          >
            {!isCompact && (
              <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover:rotate-12">
                <Settings className="h-12 w-12" aria-hidden="true" />
              </div>
            )}
            <div
              className={`relative z-10 flex items-center ${
                isCompact ? 'justify-center' : 'gap-3'
              }`}
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Foto profil"
                  className="h-10 w-10 rounded-2xl border-2 border-white shadow-sm"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-bold uppercase text-indigo-600">
                  {user?.name?.charAt(0)}
                </div>
              )}
              {!isCompact && (
                <div className="animate-in overflow-hidden fade-in slide-in-from-left-2 duration-300">
                  <p className="truncate text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[10px] font-semibold text-slate-500">{role}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={isCompact ? 'Keluar' : undefined}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider text-red-500 transition-all hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                isCompact ? 'p-2' : 'p-2.5 text-[11px]'
              }`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {!isCompact && <span>Keluar Sesi</span>}
              {isCompact && <span className="sr-only">Keluar Sesi</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`flex h-screen flex-1 flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        {/* Header Bar - Always on top */}
        <header className="sticky top-0 z-[60] flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3.5 backdrop-blur-md transition-all duration-300 print:hidden md:px-8">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <div className="min-w-0">
              <Breadcrumbs />
              <h2 className="hidden truncate text-sm font-black uppercase tracking-tight text-slate-800 md:block">
                SISWA.HUB Platform
              </h2>
              <span className="text-xs font-black tracking-tight text-slate-800 md:hidden">
                SISWA<span className="text-emerald-700">.HUB</span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari siswa (Ctrl+K)"
              className="rounded-xl p-3 text-slate-400 transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:p-2"
            >
              <Search className="h-5 w-5 transition-transform hover:scale-110" aria-hidden="true" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                aria-label="Lihat notifikasi"
                aria-expanded={isNotifOpen}
                className={`rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:p-2 ${
                  isNotifOpen ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute right-1.5 top-1.5 z-10 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-rose-500 shadow-sm" />
                )}
              </button>

              <NotificationDrawer
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </div>

            <div className="mx-1 hidden h-4 w-px bg-slate-100 sm:block" />

            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-[11px] font-black leading-none text-slate-900">{user?.name}</p>
              <div className="mt-1 flex items-center justify-end gap-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">{role}</p>
                {user?.managedClass && (
                  <>
                    <span className="text-[8px] text-slate-300">•</span>
                    <span className="rounded-md border border-emerald-100/50 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-700">
                      Kelas {user.managedClass}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label="Buka profil"
              className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white transition-all hover:ring-4 hover:ring-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:h-10 md:w-10"
            >
              {user?.picture ? (
                <img src={user.picture} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                  <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 pb-28 sm:p-8 sm:pb-32 md:pb-8">
            <div className="mx-auto max-w-[1600px] animate-slide-up space-y-8">
              <Outlet />

              <footer className="mt-20 border-t border-slate-100 pt-8 print:hidden">
                <div className="flex flex-col items-center justify-between gap-4 grayscale opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-100 md:flex-row">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Wali Kelas Digital Project &copy; 2026{' '}
                    <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                      v{getCurrentVersion()}
                    </span>
                  </p>
                  <p className="text-[10px] font-medium italic text-slate-500">
                    Designed with precision by Mohamad Lukman Nurhasyim, S.Kom, Gr.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>

      <BottomNav
        role={role}
        moreButtonRef={moreButtonRef}
        moreOpen={isMobileOpen}
        hidden={isMobileOpen}
        onMore={() => setIsMobileOpen(true)}
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} students={students} />
      <Toast />
    </div>
  );
}
