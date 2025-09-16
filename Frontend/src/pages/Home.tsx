import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageSquare, UtensilsCrossed, History, ShoppingCart, LogIn } from 'lucide-react';
import Header from '@/components/layout/Header';
import RotatingTips from '@/components/ui/rotating-tips';
import heroImage from '@/assets/hero-image.jpg';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTheme();

  const features = [
    {
      icon: MessageSquare,
      title: t('features.aiChat'),
      description: t('features.aiChatDesc'),
      link: '/ai-chat',
      color: 'primary',
    },
    {
      icon: UtensilsCrossed,
      title: t('features.analyzeNutrition') || (language === 'bn' ? 'পুষ্টি বিশ্লেষণ' : 'Analyze Nutrition'),
      description: t('features.analyzeNutritionDesc') || (language === 'bn' ? 'আপনার পুষ্টির ঘাটতি খুঁজুন' : 'Find nutrient deficiencies'),
      link: '/analyze',
      color: 'secondary',
    },
    {
      icon: History,
      title: t('features.viewRecord'),
      description: t('features.viewRecordDesc'),
      link: '/view-record',
      color: 'accent',
    },
    {
      icon: ShoppingCart,
      title: t('features.shoppingList'),
      description: t('features.shoppingListDesc'),
      link: '/shopping-list',
      color: 'highlight',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Bengali Food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
          <div className="absolute inset-0 pattern-bg opacity-20" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center text-white">
            {/* Transparent card background for better text visibility */}
            <div className="inline-block p-8 bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-8">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 animate-slide-up ${
                language === 'bn' ? 'font-bengali' : 'font-inter'
              }`}>
                <span>{t('home.welcome')} </span>
                <span className="text-gradient-hero bg-white bg-clip-text text-transparent">
                  {t('app.name')}
                </span>
              </h1>
              <p className={`text-xl md:text-2xl mb-0 text-white/90 max-w-3xl mx-auto animate-slide-up ${
                language === 'bn' ? 'font-bengali' : ''
              }`} style={{ animationDelay: '0.2s' }}>
                {t('home.subtitle')}
              </p>
            </div>
            
            {!user && (
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <p className={`text-lg mb-6 text-white/80 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('home.loginPrompt')}
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-glow"
                >
                  <Link to="/auth">
                    <LogIn className="mr-2 h-5 w-5" />
                    {t('home.getStarted')}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-highlight/30 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/30 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Rotating Tips */}
        <div className="mb-12 animate-slide-up">
          <RotatingTips />
        </div>

        {user ? (
          <>
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={feature.link}
                    className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-card animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                        ${feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                          feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                          feature.color === 'accent' ? 'bg-accent/10 text-accent' :
                          'bg-highlight/10 text-highlight'
                        } group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className={`font-semibold text-lg mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-muted-foreground text-sm mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {feature.description}
                      </p>
                      <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                        <Link to={feature.link}>
                          Explore →
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Welcome Message */}
            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-card rounded-2xl shadow-soft">
                <h2 className={`text-2xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('home.welcome')}, {user.name}! 🎉
                </h2>
                <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                  Ready to start your healthy journey today?
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto p-8 bg-gradient-card rounded-2xl shadow-soft">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('home.loginPrompt')}
              </h2>
              <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow">
                <Link to="/auth">
                  {t('home.getStarted')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;