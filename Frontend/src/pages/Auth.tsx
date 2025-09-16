import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { user, login, signup, isLoading } = useAuth();
  const { t, language } = useTheme();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = isLogin 
      ? await login(email, password)
      : await signup(name, email, password);

    if (success) {
      toast({
        title: t('auth.welcome'),
        description: isLogin ? "Welcome back!" : "Account created successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: t('auth.error'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Colorful Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="text-center">
          <Link 
            to="/" 
            className={`inline-flex items-center space-x-2 font-bold text-4xl ${
              language === 'bn' ? 'font-bengali' : 'font-inter'
            } text-white hover:scale-105 transition-transform duration-200`}
          >
            <span className="animate-pulse-soft">🥬</span>
            <span>{t('app.name')}</span>
          </Link>
          <p className={`mt-2 text-white/80 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {t('app.tagline')}
          </p>
        </div>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${language === 'bn' ? 'font-bengali' : ''}`}>
              {isLogin ? t('auth.login') : t('auth.signup')}
            </CardTitle>
            <CardDescription className={language === 'bn' ? 'font-bengali' : ''}>
              {isLogin ? t('auth.welcome') : 'Create your account'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className={language === 'bn' ? 'font-bengali' : ''}>
                    {t('auth.name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.name')}
                    className="focus:ring-primary focus:border-primary"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={language === 'bn' ? 'font-bengali' : ''}>
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@demo.com"
                  className="focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={language === 'bn' ? 'font-bengali' : ''}>
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="demo123"
                    className="focus:ring-primary focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className={`text-sm ${language === 'bn' ? 'font-bengali' : ''}`}
                    >
                      {t('auth.remember')}
                    </Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    {t('auth.forgot')}
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : (isLogin ? t('auth.login') : t('auth.signup'))}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                {' '}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0 h-auto font-medium text-primary"
                >
                  {isLogin ? t('auth.signupHere') : t('auth.loginHere')}
                </Button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Demo: demo@demo.com / demo123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;