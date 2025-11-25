'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Scan,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scan', label: 'Scan' },
    { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresAuth || (link.requiresAuth && user)
  );

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary-400 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary-400/20 blur-lg group-hover:bg-primary-400/30 transition-colors" />
            </div>
            <span className="text-xl font-bold text-dark-50">
              Smart<span className="text-primary-400">Scan</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary-400 bg-primary-400/10'
                    : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                        <User className="w-4 h-4 text-dark-950" />
                      </div>
                      <span className="hidden sm:block text-sm text-dark-200">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-dark-900 border border-dark-700 rounded-xl shadow-xl overflow-hidden"
                        >
                          <div className="p-3 border-b border-dark-700">
                            <p className="text-sm font-medium text-dark-100">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-dark-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="p-2">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:bg-dark-800 rounded-lg transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/scan"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:bg-dark-800 rounded-lg transition-colors"
                            >
                              <Scan className="w-4 h-4" />
                              New Scan
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="hidden sm:block">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-dark-200" />
              ) : (
                <Menu className="w-6 h-6 text-dark-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-800/50 bg-dark-950/95 backdrop-blur-xl"
          >
            <nav className="p-4 space-y-2">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary-400 bg-primary-400/10'
                      : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mt-4"
                >
                  <Button className="w-full">Get Started</Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
