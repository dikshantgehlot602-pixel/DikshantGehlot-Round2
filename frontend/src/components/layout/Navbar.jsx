import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useLogout } from '@/hooks/useLogout';
import { getNotifications, searchWorkspace } from '@/services/dashboardService';
import Avatar from '@/components/common/Avatar';
import { ROLE_LABELS } from '@/utils/constants';
import { formatRelativeToNow } from '@/utils/formatters';
import { getPageTitle } from './navigation';

function GlobalSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, closeMenu, open);

  const term = query.trim();

  useEffect(() => {
    if (term.length < 2) return undefined;
    let active = true;
    const timer = window.setTimeout(() => {
      searchWorkspace(user, term)
        .then((items) => {
          if (active) setResults(items);
        })
        .catch(() => {
          if (active) setResults([]);
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [term, user]);

  const visibleResults = term.length >= 2 ? results : [];

  const openResult = (href) => {
    setQuery('');
    setOpen(false);
    navigate(href);
  };

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && visibleResults[0]) openResult(visibleResults[0].href);
        }}
        placeholder="Search courses and assignments"
        aria-label="Search courses and assignments"
        className="field-input h-10 bg-slate-50 pl-9 focus:bg-white"
      />
      {open && term.length >= 2 && (
        <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in">
          {visibleResults.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">No matching courses or assignments.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {visibleResults.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openResult(item.href)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="shrink-0 text-xs text-slate-500">{item.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationsMenu() {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, closeMenu, open);
  const { data, error } = useAsyncData(() => getNotifications(user), [user.id]);
  const items = error ? [] : data ?? [];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-900"
        aria-label={`Notifications, ${items.length} items`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {items.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold">Notifications</div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">You are all caught up.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link to={item.href} onClick={() => setOpen(false)} className="block px-4 py-3 transition-colors hover:bg-slate-50">
                    <p className="text-sm font-medium text-navy-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatRelativeToNow(item.at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { user } = useAuth();
  const logout = useLogout();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, closeMenu, open);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={user.name} />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight">{user.name}</span>
          <span className="block text-xs text-slate-500">{ROLE_LABELS[user.role]}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <Link
            to={`/${user.role}/profile`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold lg:text-lg">{getPageTitle(pathname)}</h1>
      <GlobalSearch />
      <NotificationsMenu />
      <ProfileMenu />
    </header>
  );
}
