import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { Send, Bot, User, Home } from 'lucide-react';
import Header from '@/components/layout/Header';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AiChat: React.FC = () => {
  const { t, language } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'bn' 
        ? 'নমস্কার! আমি আপনার এআই পুষ্টি সহায়ক। আপনার স্বাস্থ্যকর খাবার নিয়ে কোন প্রশ্ন আছে?'
        : 'Hello! I\'m your AI nutrition assistant. What questions do you have about healthy eating?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock AI responses
  const aiResponses = {
    en: [
      "Great question! For Bengali cuisine, I recommend incorporating more leafy greens like spinach and mustard greens. They're rich in iron and folate.",
      "Fish is an excellent protein source in Bengali diet. Try to include fatty fish like hilsa or rohu 2-3 times a week for omega-3 fatty acids.",
      "Rice and lentils together make a complete protein. Try adding turmeric and ginger for anti-inflammatory benefits.",
      "Bengali sweets are delicious but high in sugar. Try having them in moderation - maybe 2-3 times a week in small portions.",
      "Vegetables like bottle gourd, ridge gourd, and eggplant are excellent choices. They're low in calories but high in nutrients.",
      "For breakfast, try having poha with vegetables or idli with sambar. Both are nutritious and easy to digest.",
    ],
    bn: [
      "চমৎকার প্রশ্ন! বাংলা খাবারের জন্য, আমি পালং শাক এবং সরিষা শাকের মতো আরও সবুজ শাকসবজি অন্তর্ভুক্ত করার পরামর্শ দিই। এগুলো আয়রন এবং ফোলেট সমৃদ্ধ।",
      "মাছ বাংলা খাবারে একটি চমৎকার প্রোটিন উৎস। ওমেগা-৩ ফ্যাটি অ্যাসিডের জন্য সপ্তাহে ২-৩ বার ইলিশ বা রুই মাছ খাওয়ার চেষ্টা করুন।",
      "ভাত এবং ডাল একসাথে সম্পূর্ণ প্রোটিন তৈরি করে। প্রদাহবিরোধী উপকারের জন্য হলুদ এবং আদা যোগ করার চেষ্টা করুন।",
      "বাংলা মিষ্টি সুস্বাদু কিন্তু চিনিতে বেশি। এগুলো পরিমিতভাবে খাওয়ার চেষ্টা করুন - হয়তো সপ্তাহে ২-৩ বার ছোট অংশে।",
      "লাউ, ঝিঙা এবং বেগুনের মতো সবজি চমৎকার পছন্দ। এগুলো কম ক্যালোরি কিন্তু পুষ্টিতে বেশি।",
      "সকালের নাস্তার জন্য, সবজি দিয়ে পোহা বা সাম্বার দিয়ে ইডলি খাওয়ার চেষ্টা করুন। দুটোই পুষ্টিকর এবং হজম করা সহজ।",
    ]
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = aiResponses[language];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: randomResponse,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('page.aiChat')}
            </h1>
            <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
              Get personalized nutrition advice from our AI assistant
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>

        {/* Chat Interface */}
        <Card className="max-w-4xl mx-auto h-[600px] flex flex-col bg-gradient-card border-0 shadow-strong">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-white dark:bg-gray-800 border'
                      } ${language === 'bn' ? 'font-bengali' : ''}`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার প্রশ্ন টাইপ করুন...' : 'Type your nutrition question...'}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 focus:ring-primary focus:border-primary"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        <div className="max-w-4xl mx-auto mt-6">
          <p className={`text-sm text-muted-foreground mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {language === 'bn' ? 'দ্রুত প্রশ্ন:' : 'Quick questions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {(language === 'bn' ? [
              'স্বাস্থ্যকর বাংলা নাস্তার পরামর্শ',
              'ডায়াবেটিসের জন্য খাবার',
              'ওজন কমানোর জন্য ডায়েট প্ল্যান',
              'গর্ভাবস্থায় পুষ্টি'
            ] : [
              'Bengali breakfast ideas',
              'Diet for diabetes',
              'Weight loss meal plan',
              'Pregnancy nutrition'
            ]).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs hover:bg-primary hover:text-primary-foreground"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;