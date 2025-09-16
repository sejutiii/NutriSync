import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'bn';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Mock translations
const translations = {
  en: {
    // App name
    'app.name': 'NutriSync',
    'app.tagline': 'AI-Based Nutrition Advisor for Bangladesh',
    
    // Navigation
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.name': 'Full Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.remember': 'Remember me',
    'auth.forgot': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupHere': 'Sign up here',
    'auth.loginHere': 'Login here',
    'auth.welcome': 'Welcome to NutriSync',
    'auth.error': 'Invalid credentials. Try demo@demo.com / demo123',
    
    // Home
    'home.welcome': 'Welcome to',
    'home.subtitle': 'Your AI-powered nutrition companion for healthy Bengali meals',
    'home.loginPrompt': 'Please log in to access NutriSync features',
    'home.getStarted': 'Get Started',
    
    // Features
    'features.aiChat': 'Talk to AI for Suggestions',
    'features.aiChatDesc': 'Get personalized nutrition advice',
    'features.recordFood': 'Record Food',
    'features.recordFoodDesc': 'Track your daily meals',
    'features.viewRecord': 'View Record',
    'features.viewRecordDesc': 'See your nutrition history',
    'features.shoppingList': 'Make Shopping List',
    'features.shoppingListDesc': 'Create healthy meal plans',
    
    // Tips
    'tips.rotating': 'Nutrition Tips',
    'tip.1': 'Include colorful vegetables in every meal for optimal nutrition',
    'tip.2': 'Bengali fish provides excellent omega-3 fatty acids',
    'tip.3': 'Lentils and rice create a complete protein combination',
    'tip.4': 'Green leafy vegetables are rich in iron and folate',
    'tip.5': 'Turmeric has powerful anti-inflammatory properties',
    
    // Pages
    'page.aiChat': 'AI Nutrition Chat',
    'page.recordFood': 'Record Your Food',
    'page.viewRecord': 'Your Nutrition Record',
    'page.shoppingList': 'Smart Shopping List',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.back': 'Back to Home',
  },
  bn: {
    // App name
    'app.name': 'নিউট্রিসিঙ্ক',
    'app.tagline': 'বাংলাদেশের জন্য এআই-ভিত্তিক পুষ্টি পরামর্শদাতা',
    
    // Navigation
    'nav.home': 'হোম',
    'nav.login': 'লগইন',
    'nav.signup': 'সাইন আপ',
    'nav.logout': 'লগআউট',
    
    // Auth
    'auth.login': 'লগইন',
    'auth.signup': 'সাইন আপ',
    'auth.name': 'পূর্ণ নাম',
    'auth.email': 'ইমেইল',
    'auth.password': 'পাসওয়ার্ড',
    'auth.remember': 'আমাকে মনে রাখুন',
    'auth.forgot': 'পাসওয়ার্ড ভুলে গেছেন?',
    'auth.noAccount': 'অ্যাকাউন্ট নেই?',
    'auth.hasAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    'auth.signupHere': 'এখানে সাইন আপ করুন',
    'auth.loginHere': 'এখানে লগইন করুন',
    'auth.welcome': 'নিউট্রিসিঙ্কে স্বাগতম',
    'auth.error': 'ভুল তথ্য। demo@demo.com / demo123 চেষ্টা করুন',
    
    // Home
    'home.welcome': 'স্বাগতম',
    'home.subtitle': 'স্বাস্থ্যকর বাংলা খাবারের জন্য আপনার এআই-চালিত পুষ্টি সঙ্গী',
    'home.loginPrompt': 'নিউট্রিসিঙ্ক ফিচার ব্যবহার করতে লগইন করুন',
    'home.getStarted': 'শুরু করুন',
    
    // Features
    'features.aiChat': 'পরামর্শের জন্য এআই এর সাথে কথা বলুন',
    'features.aiChatDesc': 'ব্যক্তিগত পুষ্টি পরামর্শ পান',
    'features.recordFood': 'খাবার রেকর্ড করুন',
    'features.recordFoodDesc': 'আপনার দৈনিক খাবার ট্র্যাক করুন',
    'features.viewRecord': 'রেকর্ড দেখুন',
    'features.viewRecordDesc': 'আপনার পুষ্টির ইতিহাস দেখুন',
    'features.shoppingList': 'কেনাকাটার তালিকা তৈরি করুন',
    'features.shoppingListDesc': 'স্বাস্থ্যকর খাবারের পরিকল্পনা করুন',
    
    // Tips
    'tips.rotating': 'পুষ্টি টিপস',
    'tip.1': 'সর্বোচ্চ পুষ্টির জন্য প্রতিটি খাবারে রঙিন সবজি অন্তর্ভুক্ত করুন',
    'tip.2': 'বাংলা মাছ চমৎকার ওমেগা-৩ ফ্যাটি অ্যাসিড প্রদান করে',
    'tip.3': 'ডাল এবং ভাত একসাথে সম্পূর্ণ প্রোটিন তৈরি করে',
    'tip.4': 'সবুজ শাকসবজি আয়রন এবং ফোলেট সমৃদ্ধ',
    'tip.5': 'হলুদের শক্তিশালী প্রদাহবিরোধী বৈশিষ্ট্য রয়েছে',
    
    // Pages
    'page.aiChat': 'এআই পুষ্টি চ্যাট',
    'page.recordFood': 'আপনার খাবার রেকর্ড করুন',
    'page.viewRecord': 'আপনার পুষ্টি রেকর্ড',
    'page.shoppingList': 'স্মার্ট কেনাকাটার তালিকা',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'কিছু ভুল হয়েছে',
    'common.save': 'সেভ করুন',
    'common.cancel': 'বাতিল',
    'common.submit': 'জমা দিন',
    'common.search': 'অনুসন্ধান',
    'common.back': 'হোমে ফিরুন',
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedTheme = localStorage.getItem('nutrisync-theme') as Theme;
    const storedLanguage = localStorage.getItem('nutrisync-language') as Language;
    
    if (storedTheme) setTheme(storedTheme);
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('nutrisync-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nutrisync-language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};