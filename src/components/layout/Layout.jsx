import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Header
        menuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        onCloseMenu={closeMenu}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
