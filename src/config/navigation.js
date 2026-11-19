import {
  LayoutDashboard, Users, BookOpen, LibraryBig, ClipboardList, Wallet,
  Sun, Moon, Calendar, Clock, FileText, CalendarCheck, PhoneCall,
  MessageCircle, Bell, User
} from 'lucide-react';

/**
 * Sumber kebenaran bersama untuk navigasi sidebar dan pembatasan route.
 * Sidebar hanya merender grup/item yang diizinkan untuk role aktif,
 * sehingga tidak ada pemisah atau judul grup kosong.
 */

export const ALL_ROLES = [
  'Wali Kelas',
  'Ketua Kelas',
  'Wakil Ketua Kelas',
  'Bendahara',
  'Wakil Bendahara',
  'Sekretaris',
  'Wakil Sekretaris',
  'Siswa',
];

const WALI = ['Wali Kelas'];
const PENGURUS_PRESENSI = ['Wali Kelas', 'Ketua Kelas', 'Wakil Ketua Kelas', 'Sekretaris', 'Wakil Sekretaris'];
const PENGURUS_KAS = ['Wali Kelas', 'Ketua Kelas', 'Wakil Ketua Kelas', 'Bendahara', 'Wakil Bendahara'];
const BENDAHARA = ['Wali Kelas', 'Bendahara', 'Wakil Bendahara'];

export const ROUTE_ROLES = {
  dashboard: ALL_ROLES,
  'master-siswa': WALI,
  profile: ALL_ROLES,
  tanggungan: BENDAHARA,
  'presensi-pagi': PENGURUS_PRESENSI,
  'presensi-siang': PENGURUS_PRESENSI,
  laporan: WALI,
  'laporan-harian': WALI,
  'buku-klaper': WALI,
  dkn: WALI,
  'catatan-terlambat': WALI,
  'update-presensi': [],
  keuangan: PENGURUS_KAS,
  panggilan: WALI,
  piket: ALL_ROLES,
  notifications: ALL_ROLES,
  feedback: ALL_ROLES,
};

export const NAV_GROUPS = [
  {
    id: 'utama',
    label: null,
    items: [
      { id: 'dashboard', to: 'dashboard', label: 'Dashboard', shortLabel: 'Beranda', icon: LayoutDashboard, roles: ROUTE_ROLES.dashboard },
    ],
  },
  {
    id: 'manajemen-data',
    label: 'Manajemen Data',
    items: [
      { id: 'master-siswa', to: 'master-siswa', label: 'Data Siswa', shortLabel: 'Siswa', icon: Users, roles: ROUTE_ROLES['master-siswa'] },
      { id: 'buku-klaper', to: 'buku-klaper', label: 'Buku Klaper', icon: BookOpen, roles: ROUTE_ROLES['buku-klaper'] },
      { id: 'dkn', to: 'dkn', label: 'Leger', icon: LibraryBig, roles: ROUTE_ROLES.dkn },
    ],
  },
  {
    id: 'keuangan',
    label: 'Keuangan',
    items: [
      { id: 'tanggungan', to: 'tanggungan', label: 'Tanggungan KAS', shortLabel: 'Tagihan', icon: ClipboardList, roles: ROUTE_ROLES.tanggungan },
      { id: 'keuangan', to: 'keuangan', label: 'KAS Kelas', shortLabel: 'KAS', icon: Wallet, roles: ROUTE_ROLES.keuangan },
    ],
  },
  {
    id: 'presensi',
    label: 'Presensi',
    items: [
      { id: 'presensi-pagi', to: 'presensi-pagi', label: 'Presensi Pagi', shortLabel: 'Presensi', icon: Sun, roles: ROUTE_ROLES['presensi-pagi'] },
      { id: 'presensi-siang', to: 'presensi-siang', label: 'Presensi Siang', icon: Moon, roles: ROUTE_ROLES['presensi-siang'] },
      { id: 'piket', to: 'piket', label: 'Jadwal Piket', shortLabel: 'Piket', icon: Calendar, roles: ROUTE_ROLES.piket },
      { id: 'catatan-terlambat', to: 'catatan-terlambat', label: 'Catatan Terlambat', icon: Clock, roles: ROUTE_ROLES['catatan-terlambat'] },
    ],
  },
  {
    id: 'pelaporan',
    label: 'Pelaporan',
    items: [
      { id: 'laporan', to: 'laporan', label: 'Laporan Akhir', shortLabel: 'Laporan', icon: FileText, roles: ROUTE_ROLES.laporan },
      { id: 'laporan-harian', to: 'laporan-harian', label: 'Laporan Harian', icon: CalendarCheck, roles: ROUTE_ROLES['laporan-harian'] },
    ],
  },
  {
    id: 'komunikasi',
    label: 'Komunikasi',
    items: [
      { id: 'panggilan', to: 'panggilan', label: 'Log Panggilan', shortLabel: 'Panggilan', icon: PhoneCall, roles: ROUTE_ROLES.panggilan },
      { id: 'feedback', to: 'feedback', label: 'Feedback', icon: MessageCircle, roles: ROUTE_ROLES.feedback },
    ],
  },
  {
    id: 'akun',
    label: 'Akun',
    items: [
      { id: 'notifications', to: 'notifications', label: 'Notifikasi', shortLabel: 'Notifikasi', icon: Bell, roles: ROUTE_ROLES.notifications },
      { id: 'profile', to: 'profile', label: 'Profil', icon: User, roles: ROUTE_ROLES.profile },
    ],
  },
];

export function canAccess(roles, role) {
  return Array.isArray(roles) && roles.length > 0 && roles.includes(role);
}

// Urutan item yang paling sering dipakai di layar kecil.
const MOBILE_PRIORITY = [
  'dashboard',
  'presensi-pagi',
  'master-siswa',
  'tanggungan',
  'keuangan',
  'piket',
  'laporan',
  'panggilan',
  'feedback',
  'notifications',
  'profile',
];

export function getMobilePrimaryItems(role, limit = 4) {
  const items = NAV_GROUPS.flatMap((group) => group.items);

  return MOBILE_PRIORITY.map((id) => items.find((item) => item.id === id))
    .filter((item) => item && canAccess(item.roles, role))
    .slice(0, limit);
}
