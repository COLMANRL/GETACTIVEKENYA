import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Navigation links
  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Book Session", href: "#book" },
    { name: "About Us", href: "#about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact" }
  ];

  // Handle navigation click on mobile
  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    // Optional: Smooth scroll for anchor links
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            GA Kenya
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium text-gray-600 hover:text-green-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
            Login
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 z-50 p-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Fixed positioning for reliability */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white py-4 px-4 shadow-lg z-40 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-gray-600 hover:text-green-500 transition-colors py-2"
                onClick={() => handleNavClick(link.href)}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity mt-2">
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
