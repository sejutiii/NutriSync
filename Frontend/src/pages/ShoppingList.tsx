import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Home, DollarSign, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  category: string;
  purchased: boolean;
}

const ShoppingList: React.FC = () => {
  const { t, language } = useTheme();
  const { toast } = useToast();
  const [budget, setBudget] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    category: 'vegetables',
  });

  // Sample Bengali grocery items with local prices (in BDT)
  const sampleItems = {
    breakfast: [
      { name: language === 'bn' ? 'চাল' : 'Rice', quantity: '2', unit: 'kg', price: 120, category: 'grains' },
      { name: language === 'bn' ? 'ডাল (মসুর)' : 'Lentils (Masoor)', quantity: '1', unit: 'kg', price: 140, category: 'legumes' },
      { name: language === 'bn' ? 'দুধ' : 'Milk', quantity: '1', unit: 'liter', price: 65, category: 'dairy' },
      { name: language === 'bn' ? 'ডিম' : 'Eggs', quantity: '12', unit: 'pieces', price: 144, category: 'protein' },
    ],
    lunch: [
      { name: language === 'bn' ? 'রুই মাছ' : 'Rohu Fish', quantity: '1', unit: 'kg', price: 350, category: 'protein' },
      { name: language === 'bn' ? 'পালং শাক' : 'Spinach', quantity: '500', unit: 'grams', price: 30, category: 'vegetables' },
      { name: language === 'bn' ? 'আলু' : 'Potato', quantity: '2', unit: 'kg', price: 50, category: 'vegetables' },
      { name: language === 'bn' ? 'পেঁয়াজ' : 'Onion', quantity: '1', unit: 'kg', price: 40, category: 'vegetables' },
    ],
    dinner: [
      { name: language === 'bn' ? 'চিকেন' : 'Chicken', quantity: '1', unit: 'kg', price: 280, category: 'protein' },
      { name: language === 'bn' ? 'আটা' : 'Wheat Flour', quantity: '2', unit: 'kg', price: 80, category: 'grains' },
      { name: language === 'bn' ? 'বেগুন' : 'Eggplant', quantity: '500', unit: 'grams', price: 35, category: 'vegetables' },
    ],
    healthy: [
      { name: language === 'bn' ? 'টমেটো' : 'Tomato', quantity: '1', unit: 'kg', price: 60, category: 'vegetables' },
      { name: language === 'bn' ? 'গাজর' : 'Carrot', quantity: '500', unit: 'grams', price: 40, category: 'vegetables' },
      { name: language === 'bn' ? 'কলা' : 'Banana', quantity: '1', unit: 'dozen', price: 60, category: 'fruits' },
      { name: language === 'bn' ? 'আপেল' : 'Apple', quantity: '1', unit: 'kg', price: 180, category: 'fruits' },
    ],
  };

  const generateList = () => {
    if (!mealPlan) {
      toast({
        title: "Error",
        description: language === 'bn' ? 'দয়া করে একটি খাবারের পরিকল্পনা নির্বাচন করুন' : 'Please select a meal plan',
        variant: "destructive",
      });
      return;
    }

    const selectedItems = sampleItems[mealPlan] || [];
    const newItems: ShoppingItem[] = selectedItems.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      ...item,
      purchased: false,
    }));

    setItems(newItems);
    toast({
      title: language === 'bn' ? 'সফল!' : 'Success!',
      description: language === 'bn' ? 'কেনাকাটার তালিকা তৈরি হয়েছে' : 'Shopping list generated successfully',
    });
  };

  const addCustomItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      toast({
        title: "Error",
        description: language === 'bn' ? 'সব ক্ষেত্র পূরণ করুন' : 'Please fill in all fields',
        variant: "destructive",
      });
      return;
    }

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      price: parseFloat(newItem.price),
      category: newItem.category,
      purchased: false,
    };

    setItems([...items, item]);
    setNewItem({ name: '', quantity: '', unit: 'kg', price: '', category: 'vegetables' });
  };

  const togglePurchased = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalCost = items.reduce((sum, item) => sum + item.price, 0);
  const remainingBudget = budget ? parseFloat(budget) - totalCost : 0;
  const purchasedItems = items.filter(item => item.purchased).length;

  const getCategoryColor = (category: string) => {
    const colors = {
      vegetables: 'bg-primary',
      fruits: 'bg-secondary',
      protein: 'bg-accent',
      grains: 'bg-highlight text-highlight-foreground',
      dairy: 'bg-purple-500',
      legumes: 'bg-orange-500',
    };
    return colors[category] || 'bg-muted';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      vegetables: language === 'bn' ? 'সবজি' : 'Vegetables',
      fruits: language === 'bn' ? 'ফল' : 'Fruits',
      protein: language === 'bn' ? 'প্রোটিন' : 'Protein',
      grains: language === 'bn' ? 'শস্য' : 'Grains',
      dairy: language === 'bn' ? 'দুগ্ধজাত' : 'Dairy',
      legumes: language === 'bn' ? 'ডাল' : 'Legumes',
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('page.shoppingList')}
            </h1>
            <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
              Create smart shopping lists based on your meal plans
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - List Generation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Budget Setting */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  {language === 'bn' ? 'বাজেট সেট করুন' : 'Set Budget'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'বাজেট (টাকা)' : 'Budget (BDT)'}
                    </Label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="1000"
                      className="focus:ring-primary focus:border-primary"
                    />
                  </div>
                  {budget && (
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className={language === 'bn' ? 'font-bengali' : ''}>
                          {language === 'bn' ? 'মোট খরচ:' : 'Total Cost:'}
                        </span>
                        <span className="font-medium">৳{totalCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={language === 'bn' ? 'font-bengali' : ''}>
                          {language === 'bn' ? 'বাকি:' : 'Remaining:'}
                        </span>
                        <span className={`font-medium ${remainingBudget >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          ৳{remainingBudget}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan Selection */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <ShoppingCart className="mr-2 h-5 w-5 text-secondary" />
                  {language === 'bn' ? 'খাবারের পরিকল্পনা' : 'Meal Plan'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'পরিকল্পনা নির্বাচন করুন' : 'Select Plan'}
                    </Label>
                    <Select value={mealPlan} onValueChange={setMealPlan}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'bn' ? 'নির্বাচন করুন' : 'Choose a meal plan'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">{language === 'bn' ? 'সকালের নাস্তার জন্য' : 'For Healthy Breakfast'}</SelectItem>
                        <SelectItem value="lunch">{language === 'bn' ? 'দুপুরের খাবারের জন্য' : 'For Nutritious Lunch'}</SelectItem>
                        <SelectItem value="dinner">{language === 'bn' ? 'রাতের খাবারের জন্য' : 'For Balanced Dinner'}</SelectItem>
                        <SelectItem value="healthy">{language === 'bn' ? 'স্বাস্থ্যকর খাবারের জন্য' : 'For Healthy Lifestyle'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={generateList} className="w-full bg-gradient-primary">
                    {language === 'bn' ? 'তালিকা তৈরি করুন' : 'Generate List'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Custom Item */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                  <Plus className="mr-2 h-5 w-5 text-accent" />
                  {language === 'bn' ? 'কাস্টম আইটেম যোগ করুন' : 'Add Custom Item'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className={language === 'bn' ? 'font-bengali' : ''}>
                      {language === 'bn' ? 'পণ্যের নাম' : 'Item Name'}
                    </Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder={language === 'bn' ? 'যেমন: গাজর' : 'e.g., Carrot'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'পরিমাণ' : 'Quantity'}
                      </Label>
                      <Input
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'একক' : 'Unit'}
                      </Label>
                      <Select value={newItem.unit} onValueChange={(value) => setNewItem({...newItem, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="grams">grams</SelectItem>
                          <SelectItem value="pieces">pieces</SelectItem>
                          <SelectItem value="liter">liter</SelectItem>
                          <SelectItem value="dozen">dozen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'দাম (টাকা)' : 'Price (BDT)'}
                      </Label>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label className={language === 'bn' ? 'font-bengali' : ''}>
                        {language === 'bn' ? 'ক্যাটেগরি' : 'Category'}
                      </Label>
                      <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetables">{language === 'bn' ? 'সবজি' : 'Vegetables'}</SelectItem>
                          <SelectItem value="fruits">{language === 'bn' ? 'ফল' : 'Fruits'}</SelectItem>
                          <SelectItem value="protein">{language === 'bn' ? 'প্রোটিন' : 'Protein'}</SelectItem>
                          <SelectItem value="grains">{language === 'bn' ? 'শস্য' : 'Grains'}</SelectItem>
                          <SelectItem value="dairy">{language === 'bn' ? 'দুগ্ধজাত' : 'Dairy'}</SelectItem>
                          <SelectItem value="legumes">{language === 'bn' ? 'ডাল' : 'Legumes'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={addCustomItem} className="w-full bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    {language === 'bn' ? 'যোগ করুন' : 'Add Item'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shopping List */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-strong">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                    <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                    {language === 'bn' ? 'কেনাকাটার তালিকা' : 'Shopping List'}
                  </CardTitle>
                  {items.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {purchasedItems}/{items.length} {language === 'bn' ? 'সম্পন্ন' : 'completed'}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? 'কোন তালিকা নেই' : 'No Shopping List'}
                    </h3>
                    <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? 'একটি খাবারের পরিকল্পনা নির্বাচন করে তালিকা তৈরি করুন' : 'Select a meal plan to generate your shopping list'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 p-4 border rounded-lg transition-all ${
                          item.purchased ? 'bg-muted/30 opacity-60' : 'bg-white dark:bg-gray-800 hover:shadow-medium'
                        }`}
                      >
                        <Checkbox
                          checked={item.purchased}
                          onCheckedChange={() => togglePurchased(item.id)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${getCategoryColor(item.category)}`}>
                              {getCategoryLabel(item.category)}
                            </span>
                            <h4 className={`font-medium ${item.purchased ? 'line-through' : ''} ${language === 'bn' ? 'font-bengali' : ''}`}>
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-primary">৳{item.price}</p>
                          {item.purchased && (
                            <CheckCircle2 className="h-4 w-4 text-primary mx-auto mt-1" />
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {/* Total */}
                    <div className="border-t pt-4 mt-6">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className={language === 'bn' ? 'font-bengali' : ''}>
                          {language === 'bn' ? 'মোট:' : 'Total:'}
                        </span>
                        <span className="text-primary">৳{totalCost}</span>
                      </div>
                      {budget && (
                        <div className={`text-sm mt-2 ${remainingBudget >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {remainingBudget >= 0 
                            ? (language === 'bn' ? `বাজেটের মধ্যে! ৳${remainingBudget} বাকি` : `Within budget! ৳${remainingBudget} remaining`)
                            : (language === 'bn' ? `বাজেট ৳${Math.abs(remainingBudget)} বেশি` : `Over budget by ৳${Math.abs(remainingBudget)}`)
                          }
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;