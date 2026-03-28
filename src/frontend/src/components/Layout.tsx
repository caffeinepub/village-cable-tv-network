import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Menu, Phone, Tv, User, Wifi, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { UserRole, useUserRole } from "../hooks/useQueries";

const navLinks = [
  { to: "/", label: "HOME" },
  { to: "/packages", label: "CHANNEL PACKAGES" },
  { to: "/broadband", label: "BROADBAND PLANS" },
  { to: "/portal", label: "SUBSCRIBER PORTAL" },
  { to: "/support", label: "SUPPORT" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userRole } = useUserRole();
  const location = useLocation();
  const isLoggedIn = !!identity;
  const isAdmin = userRole === UserRole.admin;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Utility bar */}
      <div className="bg-navy text-white py-1.5 px-4 flex items-center justify-between text-xs">
        <span className="hidden sm:block">
          Welcome to Village Cable Network &mdash; Your Community Connection
        </span>
        <div className="flex items-center gap-3 ml-auto">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-blue-300 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={() => clear()}
                className="hover:text-blue-300 transition-colors"
                data-ocid="nav.logout_button"
              >
                LOG OUT
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              className="bg-accent-blue hover:bg-opacity-90 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
              data-ocid="nav.my_account_button"
            >
              {loginStatus === "logging-in" ? "Logging in..." : "MY ACCOUNT"}
            </button>
          )}
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              data-ocid="nav.logo_link"
            >
              <div className="bg-navy rounded-lg p-2">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-navy text-base leading-tight">
                  Village Cable
                </div>
                <div className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Cable Network
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              data-ocid="nav.main_panel"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors rounded hover:text-accent-blue ${
                    location.pathname === link.to
                      ? "text-accent-blue border-b-2 border-accent-blue"
                      : "text-gray-600"
                  }`}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 rounded text-gray-600 hover:text-navy"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.mobile_menu_button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t bg-white px-4 py-3 space-y-1"
            data-ocid="nav.mobile_panel"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 text-sm font-semibold tracking-wide uppercase rounded transition-colors ${
                  location.pathname === link.to
                    ? "text-accent-blue bg-secondary"
                    : "text-gray-600 hover:text-accent-blue"
                }`}
                onClick={() => setMobileOpen(false)}
                data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & desc */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent-blue rounded-lg p-2">
                  <Tv className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-base">
                    Village Cable
                  </div>
                  <div className="text-[10px] text-blue-300 tracking-widest uppercase">
                    Cable Network
                  </div>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Connecting our village with reliable cable TV and high-speed
                broadband since 2005. Locally owned, community focused.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-blue-200 hover:text-white text-sm transition-colors flex items-center gap-1"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">
                Our Services
              </h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li className="flex items-center gap-2">
                  <Tv className="w-3 h-3" /> Cable TV Packages
                </li>
                <li className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" /> Broadband Internet
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-3 h-3" /> Subscriber Portal
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3 h-3" /> 24/7 Support
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">
                Contact Us
              </h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>📞 +1 (555) 234-5678</li>
                <li>✉️ support@villagecable.net</li>
                <li>📍 12 Main Street, Village Center</li>
                <li>🕐 Mon–Sat: 8am–6pm</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
            <span>
              © {new Date().getFullYear()} Village Cable Network. All rights
              reserved.
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="underline hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
