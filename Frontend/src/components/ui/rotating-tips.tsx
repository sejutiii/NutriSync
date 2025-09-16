import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const RotatingTips: React.FC = () => {
  const { t } = useTheme();
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    t('tip.1'),
    t('tip.2'),
    t('tip.3'),
    t('tip.4'),
    t('tip.5'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient-card rounded-2xl p-6 shadow-soft border border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center animate-bounce-soft">
              <Lightbulb className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
              <span>{t('tips.rotating')}</span>
              <ChevronRight className="h-5 w-5 ml-2 animate-pulse" />
            </h3>
            
            <div className="relative h-16 overflow-hidden">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentTip
                      ? 'opacity-100 translate-y-0'
                      : index < currentTip
                      ? 'opacity-0 -translate-y-4'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Progress indicators */}
            <div className="flex space-x-2 mt-4">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentTip
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatingTips;