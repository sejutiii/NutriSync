import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Home, User, Activity, Clock, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';

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
  const [step, setStep] = useState(2); // Start from food selection since personal data comes from user context
  const [consumptionMode, setConsumptionMode] = useState(''); // 'quick' or 'detailed'
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [amount, setAmount] = useState([100]);
  const [unit, setUnit] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMeal, setCurrentMeal] = useState('breakfast'); // for detailed mode

  // Food database with categories
  const foodDatabase = {
    carbs: {
      name: language === 'bn' ? 'কার্বোহাইড্রেট' : 'Carbohydrates',
      items: [
        { name: language === 'bn' ? 'ভাত' : 'Rice', units: ['plates', 'bowls', 'cups'] },
        { name: language === 'bn' ? 'রুটি' : 'Roti', units: ['pieces'] },
        { name: language === 'bn' ? 'পরোটা' : 'Paratha', units: ['pieces'] },
        { name: language === 'bn' ? 'পাউরুটি' : 'Bread', units: ['slices'] },
        { name: language === 'bn' ? 'নুডুলস' : 'Noodles', units: ['plates', 'bowls'] }
      ]
    },
    vegetables: {
      name: language === 'bn' ? 'সবজি' : 'Vegetables',
      items: [
        { name: language === 'bn' ? 'পালং শাক' : 'Spinach', units: ['bowls', 'plates'] },
        { name: language === 'bn' ? 'বেগুন' : 'Eggplant', units: ['pieces', 'bowls'] },
        { name: language === 'bn' ? 'আলু' : 'Potato', units: ['pieces', 'bowls'] },
        { name: language === 'bn' ? 'গাজর' : 'Carrot', units: ['pieces', 'bowls'] },
        { name: language === 'bn' ? 'টমেটো' : 'Tomato', units: ['pieces', 'bowls'] }
      ]
    },
    fruits: {
      name: language === 'bn' ? 'ফল' : 'Fruits',
      items: [
        { name: language === 'bn' ? 'আম' : 'Mango', units: ['pieces'] },
        { name: language === 'bn' ? 'কলা' : 'Banana', units: ['pieces'] },
        { name: language === 'bn' ? 'আপেল' : 'Apple', units: ['pieces'] },
        { name: language === 'bn' ? 'কমলা' : 'Orange', units: ['pieces'] },
        { name: language === 'bn' ? 'পেঁপে' : 'Papaya', units: ['pieces', 'bowls'] }
      ]
    },
    eggs: {
      name: language === 'bn' ? 'ডিম' : 'Eggs',
      items: [
        { name: language === 'bn' ? 'সিদ্ধ ডিম' : 'Boiled Egg', units: ['pieces'] },
        { name: language === 'bn' ? 'ভাজি ডিম' : 'Fried Egg', units: ['pieces'] },
        { name: language === 'bn' ? 'অমলেট' : 'Omelette', units: ['pieces'] }
      ]
    },
    dairy: {
      name: language === 'bn' ? 'দুধ ও দুগ্ধজাত' : 'Milk & Dairy',
      items: [
        { name: language === 'bn' ? 'গরুর দুধ' : 'Cow Milk', units: ['glasses', 'cups'] },
        { name: language === 'bn' ? 'ছাগলের দুধ' : 'Goat Milk', units: ['glasses', 'cups'] },
        { name: language === 'bn' ? 'দই' : 'Yogurt', units: ['bowls', 'cups'] },
        { name: language === 'bn' ? 'পনির' : 'Cheese', units: ['pieces', 'slices'] }
      ]
    },
    fish: {
      name: language === 'bn' ? 'মাছ' : 'Fish',
      items: [
        { name: language === 'bn' ? 'রুই মাছ' : 'Rohu Fish', units: ['pieces-small', 'pieces-medium', 'pieces-large'] },
        { name: language === 'bn' ? 'কাতলা মাছ' : 'Catla Fish', units: ['pieces-small', 'pieces-medium', 'pieces-large'] },
        { name: language === 'bn' ? 'ইলিশ মাছ' : 'Hilsa Fish', units: ['pieces-small', 'pieces-medium', 'pieces-large'] }
      ]
    },
    meat: {
      name: language === 'bn' ? 'মাংস' : 'Meat',
      items: [
        { name: language === 'bn' ? 'গরুর মাংস' : 'Beef', units: ['pieces-small', 'pieces-medium', 'pieces-large'] },
        { name: language === 'bn' ? 'খাসির মাংস' : 'Mutton', units: ['pieces-small', 'pieces-medium', 'pieces-large'] },
        { name: language === 'bn' ? 'মুরগির মাংস' : 'Chicken', units: ['pieces-small', 'pieces-medium', 'pieces-large'] }
      ]
    },
    lentils: {
      name: language === 'bn' ? 'ডাল ও শিম' : 'Lentils & Beans',
      items: [
        { name: language === 'bn' ? 'মসুর ডাল' : 'Red Lentil', units: ['bowls', 'cups'] },
        { name: language === 'bn' ? 'মুগ ডাল' : 'Mung Dal', units: ['bowls', 'cups'] },
        { name: language === 'bn' ? 'ছোলা' : 'Chickpeas', units: ['bowls', 'cups'] }
      ]
    }
  };

  const filteredFoods = currentCategory && foodDatabase[currentCategory] 
    ? foodDatabase[currentCategory].items.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handlePersonalDataSubmit = () => {
    // Personal data already available from user context, go to step 2
    setStep(2);
  };

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
      unit: unit
    };

    setSelectedFoods([...selectedFoods, newFood]);
    setSelectedFood('');
    setSearchQuery('');
    setAmount([100]);
    setUnit('');
  };

  const handleAnalyze = () => {
    if (selectedFoods.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one food item",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Save analysis results to localStorage
      const analysisResult = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        user: user ? {
          name: user.name,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight
        } : null,
        consumptionMode,
        foods: selectedFoods,
        deficiencies: [
          'Vitamin D', 'Iron', 'Calcium', 'Vitamin B12', 'Omega-3'
        ],
        recommendations: [
          'Add more leafy greens for iron',
          'Include fish twice a week for Omega-3',
          'Add dairy products for calcium',
          'Include fortified cereals for Vitamin B12'
        ],
        timestamp: new Date().toISOString(),
      };

      const existingAnalyses = JSON.parse(localStorage.getItem('nutrisync-analyses') || '[]');
      localStorage.setItem('nutrisync-analyses', JSON.stringify([...existingAnalyses, analysisResult]));

      setIsAnalyzing(false);
      setStep(3);
      
      toast({
        title: "Analysis Complete!",
        description: "Your nutrition analysis is ready",
      });
    }, 3000);
  };

  const getUnitDisplay = (unitKey: string) => {
    const unitMap = {
      'plates': language === 'bn' ? 'প্লেট' : 'plates',
      'bowls': language === 'bn' ? 'বাটি' : 'bowls',
      'cups': language === 'bn' ? 'কাপ' : 'cups',
      'pieces': language === 'bn' ? 'টুকরা' : 'pieces',
      'pieces-small': language === 'bn' ? 'ছোট টুকরা' : 'small pieces',
      'pieces-medium': language === 'bn' ? 'মাঝারি টুকরা' : 'medium pieces',
      'pieces-large': language === 'bn' ? 'বড় টুকরা' : 'large pieces',
      'slices': language === 'bn' ? 'স্লাইস' : 'slices',
      'glasses': language === 'bn' ? 'গ্লাস' : 'glasses'
    };
    return unitMap[unitKey] || unitKey;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'পুষ্টি বিশ্লেষণ' : 'Nutrition Analysis'}
            </h1>
            <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? 'আপনার পুষ্টির অভাব খুঁজে বের করুন' : 'Identify your nutritional gaps'}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>

        {/* Personal Data Display */}
        {user && (
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 mb-6">
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-6">
              {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'bn' ? 'নাম' : 'Name'}: </span>
                <span className="text-gray-800 dark:text-gray-200">{user.name}</span>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'bn' ? 'বয়স' : 'Age'}: </span>
                <span className="text-gray-800 dark:text-gray-200">{user.age} years</span>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'bn' ? 'লিঙ্গ' : 'Gender'}: </span>
                <span className="text-gray-800 dark:text-gray-200">{user.gender === 'M' ? (language === 'bn' ? 'পুরুষ' : 'Male') : (language === 'bn' ? 'মহিলা' : 'Female')}</span>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'bn' ? 'উচ্চতা' : 'Height'}: </span>
                <span className="text-gray-800 dark:text-gray-200">{user.height} cm</span>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'bn' ? 'ওজন' : 'Weight'}: </span>
                <span className="text-gray-800 dark:text-gray-200">{user.weight} kg</span>
              </div>
              
              <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">BMI: </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {(user.weight / Math.pow(user.height / 100, 2)).toFixed(1)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Food Selection */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Consumption Mode Selection */}
            {!consumptionMode && (
              <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                    <Activity className="mr-2 h-5 w-5 text-secondary" />
                    {language === 'bn' ? 'খাবার যোগ করার পদ্ধতি' : 'Food Entry Method'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary"
                      onClick={() => setConsumptionMode('quick')}
                    >
                      <CardContent className="p-6 text-center">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h3 className={`text-lg font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {language === 'bn' ? 'দ্রুত যোগ' : 'Quick Add'}
                        </h3>
                        <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {language === 'bn' ? 'সব খাবার একসাথে যোগ করুন' : 'Add all foods at once'}
                        </p>
                      </CardContent>
                    </Card>
                    <Card 
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary"
                      onClick={() => setConsumptionMode('detailed')}
                    >
                      <CardContent className="p-6 text-center">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-secondary" />
                        <h3 className={`text-lg font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {language === 'bn' ? 'বিস্তারিত' : 'Detailed'}
                        </h3>
                        <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {language === 'bn' ? 'খাবার আলাদা আলাদা যোগ করুন' : 'Add meals separately'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Food Category Selection and Entry */}
            {consumptionMode && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Category Selection */}
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                      <Search className="mr-2 h-5 w-5 text-primary" />
                      {language === 'bn' ? 'খাবারের ধরন নির্বাচন করুন' : 'Select Food Category'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consumptionMode === 'detailed' && (
                      <Tabs value={currentMeal} onValueChange={setCurrentMeal} className="mb-6">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="breakfast">{language === 'bn' ? 'সকাল' : 'Breakfast'}</TabsTrigger>
                          <TabsTrigger value="lunch">{language === 'bn' ? 'দুপুর' : 'Lunch'}</TabsTrigger>
                          <TabsTrigger value="dinner">{language === 'bn' ? 'রাত' : 'Dinner'}</TabsTrigger>
                          <TabsTrigger value="snacks">{language === 'bn' ? 'নাস্তা' : 'Snacks'}</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {Object.entries(foodDatabase).map(([key, category]) => (
                        <Button
                          key={key}
                          variant={currentCategory === key ? "default" : "outline"}
                          onClick={() => setCurrentCategory(key)}
                          className="h-auto p-3 text-left justify-start"
                        >
                          <span className={`text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {category.name}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {currentCategory && (
                      <div className="space-y-4">
                        <Input
                          placeholder={language === 'bn' ? 'খাবার খুঁজুন...' : 'Search foods...'}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <Select value={selectedFood} onValueChange={setSelectedFood}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'bn' ? 'খাবার নির্বাচন করুন' : 'Select food'} />
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
                              <Label className={`mb-2 block ${language === 'bn' ? 'font-bengali' : ''}`}>
                                {language === 'bn' ? 'পরিমাণ: ' : 'Amount: '} {amount[0]}
                              </Label>
                              <Slider
                                value={amount}
                                onValueChange={setAmount}
                                max={500}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <Label className={language === 'bn' ? 'font-bengali' : ''}>
                                {language === 'bn' ? 'একক' : 'Unit'}
                              </Label>
                              <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger>
                                  <SelectValue placeholder={language === 'bn' ? 'একক নির্বাচন করুন' : 'Select unit'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {filteredFoods.find(f => f.name === selectedFood)?.units.map((unitOption, index) => (
                                    <SelectItem key={index} value={unitOption}>
                                      {getUnitDisplay(unitOption)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button onClick={handleAddFood} className="w-full bg-gradient-secondary">
                              <Plus className="mr-2 h-4 w-4" />
                              {language === 'bn' ? 'যোগ করুন' : 'Add Food'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Right: Added Foods */}
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle className={`flex items-center justify-between ${language === 'bn' ? 'font-bengali' : ''}`}>
                      <span>{language === 'bn' ? 'যোগ করা খাবার' : 'Added Foods'}</span>
                      <span className="text-primary">({selectedFoods.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFoods.length === 0 ? (
                      <p className={`text-muted-foreground text-center py-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? 'এখনো কোন খাবার যোগ করা হয়নি' : 'No foods added yet'}
                      </p>
                    ) : (
                      <div className="space-y-3 mb-6">
                        {selectedFoods.map((food, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div>
                              <p className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>{food.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {food.amount} {getUnitDisplay(food.unit)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedFoods(selectedFoods.filter((_, i) => i !== index))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedFoods.length > 0 && (
                      <Button
                        onClick={handleAnalyze}
                        className="w-full bg-gradient-primary hover:shadow-glow"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {language === 'bn' ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            <Activity className="mr-2 h-4 w-4" />
                            {language === 'bn' ? 'বিশ্লেষণ করুন' : 'Analyze'}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Analysis Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold text-primary mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'বিশ্লেষণের ফলাফল' : 'Analysis Results'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nutrient Deficiencies */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className={`text-red-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'পুষ্টির ঘাটতি' : 'Nutrient Deficiencies'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Vitamin D', 'Iron', 'Calcium', 'Vitamin B12', 'Omega-3'].map((nutrient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>{nutrient}</span>
                        <span className="text-red-600 font-semibold">Low</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className={`text-green-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'সুপারিশ' : 'Recommendations'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Add more leafy greens for iron',
                      'Include fish twice a week for Omega-3',
                      'Add dairy products for calcium',
                      'Include fortified cereals for Vitamin B12'
                    ].map((recommendation, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className={`text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={() => {
                window.location.reload();
              }} className="mr-4" variant="outline">
                {language === 'bn' ? 'নতুন বিশ্লেষণ' : 'New Analysis'}
              </Button>
              <Button asChild className="bg-gradient-primary">
                <Link to="/view-record">
                  {language === 'bn' ? 'রেকর্ড দেখুন' : 'View Records'}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;