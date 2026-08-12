/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MenuIcon, CloseIcon } from '@/components/ui/icons';
import SearchField from '@/components/ui/SearchField';

const PANEL_TRANSITION_MS = 250;

export default function MobileNavigation({ navLinks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const closeTimeoutRef = useRef(null);

  function openMenu() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsRendered(true);
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    closeTimeoutRef.current = setTimeout(() => {
      setIsRendered(false);
    }, PANEL_TRANSITION_MS);
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeMenu();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div className='lg:hidden'>
      <button
        type='button'
        onClick={openMenu}
        aria-expanded={isOpen}
        aria-controls='mobile-navigation'
        aria-label='Open menu'
        className='inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-800 hover:bg-navy-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600'>
        <MenuIcon className='h-6 w-6' />
      </button>

      {isRendered && (
        <>
          <motion.div
            className='fixed inset-0 z-50 bg-navy-950/40 h-screen'
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            aria-hidden='true'
          />
          <motion.div
            id='mobile-navigation'
            role='dialog'
            aria-modal='true'
            aria-label='Mobile navigation'
            className='fixed inset-y-0 right-0 z-50 flex w-full h-screen max-w-sm flex-col gap-8 overflow-y-auto bg-cream-50 p-6 shadow-xl'
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? 0 : '100%' }}
            transition={{
              type: 'tween',
              duration: PANEL_TRANSITION_MS / 1000,
              ease: 'easeOut',
            }}>
            <div className='flex items-center justify-between'>
              <span className='font-heading text-lg text-navy-900'>Menu</span>
              <button
                type='button'
                onClick={closeMenu}
                aria-label='Close menu'
                className='inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-800 hover:bg-navy-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600'>
                <CloseIcon className='h-5 w-5' />
              </button>
            </div>

            <SearchField id='mobile-search' />

            <nav
              aria-label='Mobile'
              className='flex flex-col gap-1'>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.2 }}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className='block rounded-md px-3 py-3 text-base font-medium text-navy-800 hover:bg-navy-900/5'>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </div>
  );
}
