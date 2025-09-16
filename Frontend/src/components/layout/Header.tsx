import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Globe, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { theme, language, toggleTheme, toggleLanguage, t } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link 
          to="/" 
          className={`flex items-center space-x-2 font-bold text-2xl ${
            language === 'bn' ? 'font-bengali' : 'font-inter'
          } text-gradient-primary hover:scale-105 transition-transform duration-200`}
        >
          <span className="animate-pulse-soft">🥬</span>
          <span>{t('app.name')}</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="hover:bg-primary/10"
          >
            <Globe className="h-4 w-4 mr-1" />
            {language === 'en' ? 'বাং' : 'EN'}
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="hover:bg-primary/10"
          >
            {theme === 'light' ? 
              <Moon className="h-4 w-4" /> : 
              <Sun className="h-4 w-4" />
            }
          </Button>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
                <span className={`text-sm font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {user.name}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">{t('nav.login')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;