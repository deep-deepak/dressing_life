import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react';
import { Logo } from '@/components/common';
import { MAIN_NAV_LINKS } from '@/constants/site';
import { ROUTES } from '@/constants/routes';
import { useCartStore, useWishlistStore } from '@/store';
import { cn } from '@/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-charcoal bg-brand-black text-brand-white">
      <div className="container-page flex h-20 items-center justify-between py-3">
        <Link to={ROUTES.HOME} aria-label="Dressing Life home">
          <Logo theme="dark" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {MAIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'font-display text-sm uppercase tracking-wider text-brand-gray-300 transition-colors hover:text-brand-white',
                  isActive && 'text-brand-white underline decoration-brand-red-700 decoration-2 underline-offset-8',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to={ROUTES.PROFILE} aria-label="My profile" className="hidden text-brand-gray-200 hover:text-brand-white sm:block">
            <User size={20} />
          </Link>
          <Link to={ROUTES.WISHLIST} aria-label="Wishlist" className="relative text-brand-gray-200 hover:text-brand-white">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-brand-red-700 text-[10px] font-semibold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to={ROUTES.CART} aria-label="Cart" className="relative text-brand-gray-200 hover:text-brand-white">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-brand-red-700 text-[10px] font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-brand-gray-200 hover:text-brand-white lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-brand-charcoal px-4 py-4 lg:hidden">
          {MAIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="py-2 font-display text-sm uppercase tracking-wider text-brand-gray-300 hover:text-brand-white"
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to={ROUTES.PROFILE}
            onClick={() => setIsMenuOpen(false)}
            className="py-2 font-display text-sm uppercase tracking-wider text-brand-gray-300 hover:text-brand-white"
          >
            My Profile
          </NavLink>
        </nav>
      )}
    </header>
  );
}
