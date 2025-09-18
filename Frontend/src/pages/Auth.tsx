import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "M" as "M" | "F",
    lifestyle: "Moderately active" as
      | "Sedentary"
      | "Lightly active"
      | "Moderately active"
      | "Very active"
      | "Extra active",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { user, login, signup, isLoading } = useAuth();
  const { t, language } = useTheme();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for login specific fields
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      const success = await login(formData.email, formData.password);
      if (success) {
        toast({
          title: t("auth.welcome"),
          description: "Welcome back!",
        });
      } else {
        toast({
          title: "Error",
          description: t("auth.error"),
          variant: "destructive",
        });
      }
    } else {
      // Check for signup specific fields
      if (
        !formData.email ||
        !formData.password ||
        !formData.name ||
        !formData.age ||
        !formData.height ||
        !formData.weight ||
        !formData.gender
      ) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      const age = parseInt(formData.age);
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);

      const success = await signup(
        formData.name,
        formData.email,
        formData.password,
        age,
        height,
        weight,
        formData.gender,
        formData.lifestyle
      );
      if (success) {
        // Optionally auto-login here
        // The original code already does this, but it's a good practice to
        // make sure it's working as expected.
        const loginSuccess = await login(formData.email, formData.password);
        if (loginSuccess) {
          toast({
            title: t("auth.welcome"),
            description: "Account created and logged in!",
          });
        }
      } else {
        toast({
          title: "Error",
          description: t("auth.error"),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Colorful Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute inset-0 pattern-bg opacity-30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="text-center">
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 font-bold text-4xl ${
              language === "bn" ? "font-bengali" : "font-inter"
            } text-white hover:scale-105 transition-transform duration-200`}
          >
            <span className="animate-pulse-soft">🥬</span>
            <span>{t("app.name")}</span>
          </Link>
          <p
            className={`mt-2 text-white/80 ${
              language === "bn" ? "font-bengali" : ""
            }`}
          >
            {t("app.tagline")}
          </p>
        </div>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle
              className={`text-2xl ${language === "bn" ? "font-bengali" : ""}`}
            >
              {isLogin ? t("auth.login") : t("auth.signup")}
            </CardTitle>
            <CardDescription
              className={language === "bn" ? "font-bengali" : ""}
            >
              {isLogin ? t("auth.welcome") : "Create your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={language === "bn" ? "font-bengali" : ""}
                    >
                      {t("auth.name")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("auth.name")}
                      className="focus:ring-primary focus:border-primary"
                      required={!isLogin}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="age"
                        className={language === "bn" ? "font-bengali" : ""}
                      >
                        Age
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Enter age"
                        className="focus:ring-primary focus:border-primary"
                        required={!isLogin}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className={language === "bn" ? "font-bengali" : ""}
                      >
                        Gender
                      </Label>
                      <select
                        id="gender"
                        value={formData.gender}
                        name="gender"
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="height"
                        className={language === "bn" ? "font-bengali" : ""}
                      >
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        step="0.1"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Enter height"
                        className="focus:ring-primary focus:border-primary"
                        required={!isLogin}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="weight"
                        className={language === "bn" ? "font-bengali" : ""}
                      >
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter weight"
                        className="focus:ring-primary focus:border-primary"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  {/* Lifestyle Dropdown */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="lifestyle"
                      className={language === "bn" ? "font-bengali" : ""}
                    >
                      Lifestyle
                    </Label>
                    <select
                      id="lifestyle"
                      name="lifestyle"
                      value={formData.lifestyle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly active">Lightly active</option>
                      <option value="Moderately active">
                        Moderately active
                      </option>
                      <option value="Very active">Very active</option>
                      <option value="Extra active">Extra active</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={language === "bn" ? "font-bengali" : ""}
                >
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="demo@demo.com"
                  className="focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className={language === "bn" ? "font-bengali" : ""}
                >
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className={`text-sm ${
                        language === "bn" ? "font-bengali" : ""
                      }`}
                    >
                      {t("auth.remember")}
                    </Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    {t("auth.forgot")}
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading
                  ? t("common.loading")
                  : isLogin
                  ? t("auth.login")
                  : t("auth.signup")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p
                className={`text-sm text-muted-foreground ${
                  language === "bn" ? "font-bengali" : ""
                }`}
              >
                {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0 h-auto font-medium text-primary"
                >
                  {isLogin ? t("auth.signupHere") : t("auth.loginHere")}
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
