import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { getMobilePrimaryItems } from '../../config/navigation';
import { bottomNavStyles as styles } from './bottom-nav.styles';

export default function BottomNav({ role, moreButtonRef, moreOpen, onMore, hidden }) {
  if (hidden) return null;

  const items = getMobilePrimaryItems(role);

  return (
    <nav aria-label="Navigasi bawah" className={styles.nav}>
      {items.map(({ id, to, label, shortLabel, icon }) => {
        const Icon = icon;

        return (
          <NavLink
            key={id}
            to={to}
            end
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : styles.inactive}`}
          >
            {({ isActive }) => (
              <>
                {isActive && <span className={styles.indicator} aria-hidden="true" />}
                <Icon className={styles.icon} aria-hidden="true" />
                <span className={styles.label}>{shortLabel || label}</span>
              </>
            )}
          </NavLink>
        );
      })}

      <button
        ref={moreButtonRef}
        type="button"
        onClick={onMore}
        aria-label="Buka menu lengkap"
        aria-controls="sidebar-navigation"
        aria-expanded={moreOpen}
        className={`${styles.item} ${styles.inactive}`}
      >
        <MoreHorizontal className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>Lainnya</span>
      </button>
    </nav>
  );
}
