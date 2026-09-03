import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md">
      {/* Top Header */}
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Mobile Off-canvas Drawer */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex flex-1 pt-16">
        {/* Desktop Fixed Left Sidebar */}
        <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 border-r border-outline-variant/30 z-30 bg-surface-container-lowest">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full lg:pl-64 min-h-[calc(100vh-4rem)] bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-margin-page py-space-md sm:py-space-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
