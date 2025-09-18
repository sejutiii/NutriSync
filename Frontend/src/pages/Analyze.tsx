import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Home,
  User,
  Activity,
  Clock,
  Loader2,
  List,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";

interface PersonalData {
  name: string;
  age: string;
  gender: string;
  height: string;
  bloodGroup: string;
  area: string;
}

interface FoodItem {
  category: string;
  name: string;
  amount: number;
  unit: string;
}

const Analyze: React.FC = () => {
  const { t, language } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(2);
  const [consumptionMode, setConsumptionMode] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [amount, setAmount] = useState([100]);
  const [unit, setUnit] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodInput, setFoodInput] = useState("");
  const [foodLogged, setFoodLogged] = useState(false);

  const foodDatabase = {
    carbs: {
      name: language === "bn" ? "কার্বোহাইড্রেট" : "Carbohydrates",
      items: [
        {
          name: language === "bn" ? "ভাত" : "Rice",
          units: ["plates", "bowls", "cups"],
        },
        { name: language === "bn" ? "রুটি" : "Roti", units: ["pieces"] },
        { name: language === "bn" ? "পরোটা" : "Paratha", units: ["pieces"] },
        { name: language === "bn" ? "পাউরুটি" : "Bread", units: ["slices"] },
        {
          name: language === "bn" ? "নুডুলস" : "Noodles",
          units: ["plates", "bowls"],
        },
      ],
    },
    vegetables: {
      name: language === "bn" ? "সবজি" : "Vegetables",
      items: [
        {
          name: language === "bn" ? "পালং শাক" : "Spinach",
          units: ["bowls", "plates"],
        },
        {
          name: language === "bn" ? "বেগুন" : "Eggplant",
          units: ["pieces", "bowls"],
        },
        {
          name: language === "bn" ? "আলু" : "Potato",
          units: ["pieces", "bowls"],
        },
        {
          name: language === "bn" ? "গাজর" : "Carrot",
          units: ["pieces", "bowls"],
        },
        {
          name: language === "bn" ? "টমেটো" : "Tomato",
          units: ["pieces", "bowls"],
        },
      ],
    },
    fruits: {
      name: language === "bn" ? "ফল" : "Fruits",
      items: [
        { name: language === "bn" ? "আম" : "Mango", units: ["pieces"] },
        { name: language === "bn" ? "কলা" : "Banana", units: ["pieces"] },
        { name: language === "bn" ? "আপেল" : "Apple", units: ["pieces"] },
        { name: language === "bn" ? "কমলা" : "Orange", units: ["pieces"] },
        {
          name: language === "bn" ? "পেঁপে" : "Papaya",
          units: ["pieces", "bowls"],
        },
      ],
    },
    eggs: {
      name: language === "bn" ? "ডিম" : "Eggs",
      items: [
        {
          name: language === "bn" ? "সিদ্ধ ডিম" : "Boiled Egg",
          units: ["pieces"],
        },
        {
          name: language === "bn" ? "ভাজি ডিম" : "Fried Egg",
          units: ["pieces"],
        },
        { name: language === "bn" ? "অমলেট" : "Omelette", units: ["pieces"] },
      ],
    },
    dairy: {
      name: language === "bn" ? "দুধ ও দুগ্ধজাত" : "Milk & Dairy",
      items: [
        {
          name: language === "bn" ? "গরুর দুধ" : "Cow Milk",
          units: ["glasses", "cups"],
        },
        {
          name: language === "bn" ? "ছাগলের দুধ" : "Goat Milk",
          units: ["glasses", "cups"],
        },
        { name: language === "bn" ? "দই" : "Yogurt", units: ["bowls", "cups"] },
        {
          name: language === "bn" ? "পনির" : "Cheese",
          units: ["pieces", "slices"],
        },
      ],
    },
    fish: {
      name: language === "bn" ? "মাছ" : "Fish",
      items: [
        {
          name: language === "bn" ? "রুই মাছ" : "Rohu Fish",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
        {
          name: language === "bn" ? "কাতলা মাছ" : "Catla Fish",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
        {
          name: language === "bn" ? "ইলিশ মাছ" : "Hilsa Fish",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
      ],
    },
    meat: {
      name: language === "bn" ? "মাংস" : "Meat",
      items: [
        {
          name: language === "bn" ? "গরুর মাংস" : "Beef",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
        {
          name: language === "bn" ? "খাসির মাংস" : "Mutton",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
        {
          name: language === "bn" ? "মুরগির মাংস" : "Chicken",
          units: ["pieces-small", "pieces-medium", "pieces-large"],
        },
      ],
    },
    lentils: {
      name: language === "bn" ? "ডাল ও শিম" : "Lentils & Beans",
      items: [
        {
          name: language === "bn" ? "মসুর ডাল" : "Red Lentil",
          units: ["bowls", "cups"],
        },
        {
          name: language === "bn" ? "মুগ ডাল" : "Mung Dal",
          units: ["bowls", "cups"],
        },
        {
          name: language === "bn" ? "ছোলা" : "Chickpeas",
          units: ["bowls", "cups"],
        },
      ],
    },
  };

  const filteredFoods =
    currentCategory && foodDatabase[currentCategory]
      ? foodDatabase[currentCategory].items.filter((food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleAddFood = () => {
    if (!selectedFood || !unit) {
      toast({
        title: "Error",
        description: "Please select food and unit",
        variant: "destructive",
      });
      return;
    }

    const newFood: FoodItem = {
      category: currentCategory,
      name: selectedFood,
      amount: amount[0],
      unit: unit,
    };

    setSelectedFoods([...selectedFoods, newFood]);
    setSelectedFood("");
    setSearchQuery("");
    setAmount([100]);
    setUnit("");
  };

  const handleLogFood = () => {
    if (!foodInput.trim()) {
      toast({
        title: "Error",
        description: "Please type in your food items",
        variant: "destructive",
      });
      return;
    }
    setFoodLogged(true);
    toast({
      title: "Success",
      description: "Food logged successfully!",
    });
  };

  const handleLogFoodQuick = () => {
    if (selectedFoods.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one food item",
        variant: "destructive",
      });
      return;
    }
    setFoodLogged(true);
    toast({
      title: "Success",
      description: "Food logged successfully!",
    });
  };

  const handleAnalyzeNutritions = () => {
    toast({
      title: "Analyzing Nutritions...",
      description: "This feature is coming soon!",
    });
  };

  const handleAnalyzeCalories = () => {
    toast({
      title: "Analyzing Calories...",
      description: "This feature is coming soon!",
    });
  };

  const getUnitDisplay = (unitKey: string) => {
    const unitMap = {
      plates: language === "bn" ? "প্লেট" : "plates",
      bowls: language === "bn" ? "বাটি" : "bowls",
      cups: language === "bn" ? "কাপ" : "cups",
      pieces: language === "bn" ? "টুকরা" : "pieces",
      "pieces-small": language === "bn" ? "ছোট টুকরা" : "small pieces",
      "pieces-medium": language === "bn" ? "মাঝারি টুকরা" : "medium pieces",
      "pieces-large": language === "bn" ? "বড় টুকরা" : "large pieces",
      slices: language === "bn" ? "স্লাইস" : "slices",
      glasses: language === "bn" ? "গ্লাস" : "glasses",
    };
    return unitMap[unitKey] || unitKey;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-3xl font-bold text-primary mb-2 ${
                language === "bn" ? "font-bengali" : ""
              }`}
            >
              {language === "bn" ? "পুষ্টি বিশ্লেষণ" : "Nutrition Analysis"}
            </h1>
            <p
              className={`text-muted-foreground ${
                language === "bn" ? "font-bengali" : ""
              }`}
            >
              {language === "bn"
                ? "আপনার পুষ্টির অভাব খুঁজে বের করুন"
                : "Identify your nutritional gaps"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
        </div>

        {user && (
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 mb-6">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-6">
              {language === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {language === "bn" ? "নাম" : "Name"}:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {user.name}
                </span>
              </div>

              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {language === "bn" ? "বয়স" : "Age"}:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {user.age} years
                </span>
              </div>

              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {language === "bn" ? "লিঙ্গ" : "Gender"}:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {user.gender === "M"
                    ? language === "bn"
                      ? "পুরুষ"
                      : "Male"
                    : language === "bn"
                    ? "মহিলা"
                    : "Female"}
                </span>
              </div>

              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {language === "bn" ? "উচ্চতা" : "Height"}:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {user.height} cm
                </span>
              </div>

              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {language === "bn" ? "ওজন" : "Weight"}:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {user.weight} kg
                </span>
              </div>

              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  BMI:{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {(user.weight / Math.pow(user.height / 100, 2)).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {!consumptionMode && (
              <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle
                    className={`flex items-center ${
                      language === "bn" ? "font-bengali" : ""
                    }`}
                  >
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    {language === "bn"
                      ? "খাবার যোগ করার পদ্ধতি"
                      : "Food Entry Method"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary"
                      onClick={() => {
                        setConsumptionMode("quick");
                        setFoodLogged(false);
                        setSelectedFoods([]);
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h3
                          className={`text-lg font-semibold mb-2 ${
                            language === "bn" ? "font-bengali" : ""
                          }`}
                        >
                          {language === "bn" ? "দ্রুত যোগ" : "Quick Add"}
                        </h3>
                        <p
                          className={`text-sm text-muted-foreground ${
                            language === "bn" ? "font-bengali" : ""
                          }`}
                        >
                          {language === "bn"
                            ? "সব খাবার একসাথে যোগ করুন"
                            : "Add all foods at once"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary"
                      onClick={() => {
                        setConsumptionMode("type-food");
                        setFoodLogged(false);
                        setFoodInput("");
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <List className="h-12 w-12 mx-auto mb-4 text-tertiary" />
                        <h3
                          className={`text-lg font-semibold mb-2 ${
                            language === "bn" ? "font-bengali" : ""
                          }`}
                        >
                          {language === "bn"
                            ? "টাইপ করে খাবার যোগ করুন"
                            : "Type Your Food"}
                        </h3>
                        <p
                          className={`text-sm text-muted-foreground ${
                            language === "bn" ? "font-bengali" : ""
                          }`}
                        >
                          {language === "bn"
                            ? "আপনার খাবারের তালিকা টাইপ করুন"
                            : "Type in your food list"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {consumptionMode === "type-food" && (
              <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle
                    className={`flex items-center justify-between ${
                      language === "bn" ? "font-bengali" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <List className="mr-2 h-5 w-5 text-tertiary" />
                      {language === "bn"
                        ? "টাইপ করে খাবার যোগ করুন"
                        : "Type Your Food"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsumptionMode("")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {language === "bn" ? "ফিরে যান" : "Back"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={
                      language === "bn"
                        ? "উদাহরণ: ১ কাপ ভাত / ২ পিস মুরগির মাংস / ৫০ গ্রাম ডাল"
                        : "Example: 1 cup rice / 2 pieces chicken / 50g lentils"
                    }
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    rows={6}
                    className="resize-none"
                    disabled={foodLogged}
                  />
                  {!foodLogged ? (
                    <Button onClick={handleLogFood} className="w-full">
                      {language === "bn" ? "খাবার লগ করুন" : "Log Food"}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p
                        className={`text-center text-sm font-medium text-green-600 ${
                          language === "bn" ? "font-bengali" : ""
                        }`}
                      >
                        {language === "bn"
                          ? "খাবার সফলভাবে লগ করা হয়েছে!"
                          : "Food logged successfully!"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAnalyzeNutritions}
                          className="w-full bg-gradient-primary"
                        >
                          {language === "bn"
                            ? "পুষ্টি বিশ্লেষণ"
                            : "Analyze Nutritions"}
                        </Button>
                        <Button
                          onClick={handleAnalyzeCalories}
                          className="w-full"
                          variant="outline"
                        >
                          {language === "bn"
                            ? "ক্যালোরি বিশ্লেষণ"
                            : "Analyze Calories"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {consumptionMode === "quick" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-between ${
                        language === "bn" ? "font-bengali" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <Search className="mr-2 h-5 w-5 text-primary" />
                        {language === "bn"
                          ? "খাবারের ধরন নির্বাচন করুন"
                          : "Select Food Category"}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConsumptionMode("")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {language === "bn" ? "ফিরে যান" : "Back"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {Object.entries(foodDatabase).map(([key, category]) => (
                        <Button
                          key={key}
                          variant={
                            currentCategory === key ? "default" : "outline"
                          }
                          onClick={() => setCurrentCategory(key)}
                          className="h-auto p-3 text-left justify-start"
                        >
                          <span
                            className={`text-sm ${
                              language === "bn" ? "font-bengali" : ""
                            }`}
                          >
                            {category.name}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {currentCategory && (
                      <div className="space-y-4">
                        <Input
                          placeholder={
                            language === "bn"
                              ? "খাবার খুঁজুন..."
                              : "Search foods..."
                          }
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <Select
                          value={selectedFood}
                          onValueChange={setSelectedFood}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                language === "bn"
                                  ? "খাবার নির্বাচন করুন"
                                  : "Select food"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredFoods.map((food, index) => (
                              <SelectItem key={index} value={food.name}>
                                {food.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedFood && (
                          <div className="space-y-4">
                            <div>
                              <Label
                                className={
                                  language === "bn" ? "font-bengali" : ""
                                }
                              >
                                {language === "bn" ? "একক" : "Unit"}
                              </Label>
                              <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      language === "bn"
                                        ? "একক নির্বাচন করুন"
                                        : "Select unit"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {filteredFoods
                                    .find((f) => f.name === selectedFood)
                                    ?.units.map((unitOption, index) => (
                                      <SelectItem
                                        key={index}
                                        value={unitOption}
                                      >
                                        {getUnitDisplay(unitOption)}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label
                                className={`mb-2 block ${
                                  language === "bn" ? "font-bengali" : ""
                                }`}
                              >
                                {language === "bn" ? "পরিমাণ: " : "Amount: "}{" "}
                                {amount[0]}
                              </Label>
                              <Slider
                                value={amount}
                                onValueChange={setAmount}
                                max={15}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <Button
                              onClick={handleAddFood}
                              className="w-full bg-gradient-secondary"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {language === "bn" ? "যোগ করুন" : "Add Food"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-between ${
                        language === "bn" ? "font-bengali" : ""
                      }`}
                    >
                      <span>
                        {language === "bn" ? "যোগ করা খাবার" : "Added Foods"}
                      </span>
                      <span className="text-primary">
                        ({selectedFoods.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFoods.length === 0 ? (
                      <p
                        className={`text-muted-foreground text-center py-8 ${
                          language === "bn" ? "font-bengali" : ""
                        }`}
                      >
                        {language === "bn"
                          ? "এখনো কোন খাবার যোগ করা হয়নি"
                          : "No foods added yet"}
                      </p>
                    ) : (
                      <div className="space-y-3 mb-6">
                        {selectedFoods.map((food, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                          >
                            <div>
                              <p
                                className={`font-medium ${
                                  language === "bn" ? "font-bengali" : ""
                                }`}
                              >
                                {food.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {food.amount} {getUnitDisplay(food.unit)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setSelectedFoods(
                                  selectedFoods.filter((_, i) => i !== index)
                                )
                              }
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!foodLogged ? (
                      <Button
                        onClick={handleLogFoodQuick}
                        className="w-full bg-gradient-primary hover:shadow-glow"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {language === "bn"
                              ? "বিশ্লেষণ করা হচ্ছে..."
                              : "Logging..."}
                          </>
                        ) : (
                          <>
                            <Activity className="mr-2 h-4 w-4" />
                            {language === "bn" ? "খাবার লগ করুন" : "Log Food"}
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <p
                          className={`text-center text-sm font-medium text-green-600 ${
                            language === "bn" ? "font-bengali" : ""
                          }`}
                        >
                          {language === "bn"
                            ? "খাবার সফলভাবে লগ করা হয়েছে!"
                            : "Food logged successfully!"}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAnalyzeNutritions}
                            className="w-full bg-gradient-primary"
                          >
                            {language === "bn"
                              ? "পুষ্টি বিশ্লেষণ"
                              : "Analyze Nutritions"}
                          </Button>
                          <Button
                            onClick={handleAnalyzeCalories}
                            className="w-full"
                            variant="outline"
                          >
                            {language === "bn"
                              ? "ক্যালোরি বিশ্লেষণ"
                              : "Analyze Calories"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
