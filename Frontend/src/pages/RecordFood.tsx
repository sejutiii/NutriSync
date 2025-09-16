import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Home, UtensilsCrossed } from 'lucide-react';
import Header from '@/components/layout/Header';

interface FoodItem {
  name: string;
  quantity: string;
  unit: string;
  calories: number;
}

const RecordFood: React.FC = () => {
  const { t, language } = useTheme();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [customFood, setCustomFood] = useState({
    name: '',
    quantity: '',
    unit: 'grams',
    calories: '',
  });
  const [mealType, setMealType] = useState('');
  const [notes, setNotes] = useState('');

  // Mock Bengali food database
  const foodDatabase = [
    { name: language === 'bn' ? 'ভাত' : 'Rice', calories: 130, unit: '100g' },
    { name: language === 'bn' ? 'ডাল' : 'Lentils', calories: 116, unit: '100g' },
    { name: language === 'bn' ? 'মাছ (রুই)' : 'Fish (Rohu)', calories: 97, unit: '100g' },
    { name: language === 'bn' ? 'চিকেন' : 'Chicken', calories: 165, unit: '100g' },
    { name: language === 'bn' ? 'পালং শাক' : 'Spinach', calories: 23, unit: '100g' },
    { name: language === 'bn' ? 'বেগুন' : 'Eggplant', calories: 25, unit: '100g' },
    { name: language === 'bn' ? 'আলু' : 'Potato', calories: 77, unit: '100g' },
    { name: language === 'bn' ? 'টমেটো' : 'Tomato', calories: 18, unit: '100g' },
    { name: language === 'bn' ? 'রুটি' : 'Roti', calories: 71, unit: '1 piece' },
    { name: language === 'bn' ? 'দই' : 'Yogurt', calories: 59, unit: '100g' },
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: any, quantity: string = '100') => {
    const newFood: FoodItem = {
      name: food.name,
      quantity,
      unit: food.unit,
      calories: Math.round((food.calories * parseInt(quantity)) / 100),
    };
    setSelectedFoods([...selectedFoods, newFood]);
    setSearchQuery('');
  };

  const handleAddCustomFood = () => {
    if (!customFood.name || !customFood.quantity || !customFood.calories) {
      toast({
        title: "Error",
        description: "Please fill in all custom food fields",
        variant: "destructive",
      });
      return;
    }

    const newFood: FoodItem = {
      name: customFood.name,
      quantity: customFood.quantity,
      unit: customFood.unit,
      calories: parseInt(customFood.calories),
    };

    setSelectedFoods([...selectedFoods, newFood]);
    setCustomFood({ name: '', quantity: '', unit: 'grams', calories: '' });
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleSaveMeal = () => {
    if (selectedFoods.length === 0 || !mealType) {
      toast({
        title: "Error",
        description: "Please add at least one food item and select meal type",
        variant: "destructive",
      });
      return;
    }

    // Mock save to localStorage for demo
    const mealRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mealType,
      foods: selectedFoods,
      totalCalories: selectedFoods.reduce((sum, food) => sum + food.calories, 0),
      notes,
      timestamp: new Date().toISOString(),
    };

    const existingRecords = JSON.parse(localStorage.getItem('nutrisync-meals') || '[]');
    localStorage.setItem('nutrisync-meals', JSON.stringify([...existingRecords, mealRecord]));

    toast({
      title: "Success!",
      description: "Meal recorded successfully",
    });

    // Reset form
    setSelectedFoods([]);
    setMealType('');
    setNotes('');
  };

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('page.recordFood')}
            </h1>
            <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
              Track your daily nutrition intake
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Food Search and Custom */}
          <div className="space-y-6">
            {/* Food Search */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  {language === 'bn' ? 'খাবার খুঁজুন' : 'Search Foods'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder={language === 'bn' ? 'খাবারের নাম লিখুন...' : 'Search for food items...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-primary focus:border-primary"
                  />
                  
                  {searchQuery && (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredFoods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div>
                            <p className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>{food.name}</p>
                            <p className="text-sm text-muted-foreground">{food.calories} cal per {food.unit}</p>
                          </div>
                          <Button size="sm" onClick={() => handleAddFood(food)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Custom Food Entry */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <UtensilsCrossed className="mr-2 h-5 w-5 text-secondary" />
                  {language === 'bn' ? 'কাস্টম খাবার যোগ করুন' : 'Add Custom Food'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'খাবারের নাম' : 'Food Name'}
                    </Label>
                    <Input
                      value={customFood.name}
                      onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                      placeholder={language === 'bn' ? 'যেমন: বিরিয়ানি' : 'e.g., Biryani'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
                      </Label>
                      <Input
                        type="number"
                        value={customFood.quantity}
                        onChange={(e) => setCustomFood({...customFood, quantity: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'একক' : 'Unit'}
                      </Label>
                      <Select value={customFood.unit} onValueChange={(value) => setCustomFood({...customFood, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grams">grams</SelectItem>
                          <SelectItem value="pieces">pieces</SelectItem>
                          <SelectItem value="cups">cups</SelectItem>
                          <SelectItem value="tablespoons">tbsp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'ক্যালোরি' : 'Calories'}
                    </Label>
                    <Input
                      type="number"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({...customFood, calories: e.target.value})}
                      placeholder="250"
                    />
                  </div>
                  
                  <Button onClick={handleAddCustomFood} className="w-full bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'যোগ করুন' : 'Add Food'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Foods and Summary */}
          <div className="space-y-6">
            {/* Selected Foods */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center justify-between ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <span>{language === 'bn' ? 'নির্বাচিত খাবার' : 'Selected Foods'}</span>
                  <span className="text-primary font-bold">{totalCalories} cal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFoods.length === 0 ? (
                  <p className={`text-muted-foreground text-center py-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'কোন খাবার নির্বাচিত নেই' : 'No foods selected yet'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedFoods.map((food, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <div>
                          <p className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>{food.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.quantity} {food.unit} • {food.calories} cal
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveFood(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Meal Details */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={language === 'bn' ? 'font-bengali' : ''}>
                  {language === 'bn' ? 'খাবারের বিবরণ' : 'Meal Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'খাবারের ধরন' : 'Meal Type'}
                    </Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'bn' ? 'নির্বাচন করুন' : 'Select meal type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">{language === 'bn' ? 'সকালের নাস্তা' : 'Breakfast'}</SelectItem>
                        <SelectItem value="lunch">{language === 'bn' ? 'দুপুরের খাবার' : 'Lunch'}</SelectItem>
                        <SelectItem value="dinner">{language === 'bn' ? 'রাতের খাবার' : 'Dinner'}</SelectItem>
                        <SelectItem value="snack">{language === 'bn' ? 'নাস্তা' : 'Snack'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'নোট (ঐচ্ছিক)' : 'Notes (Optional)'}
                    </Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'কোন অতিরিক্ত তথ্য...' : 'Any additional notes...'}
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSaveMeal}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                    disabled={selectedFoods.length === 0 || !mealType}
                  >
                    {language === 'bn' ? 'খাবার সেভ করুন' : 'Save Meal'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordFood;