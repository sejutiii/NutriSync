import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, Home, TrendingUp, UtensilsCrossed, BarChart3 } from 'lucide-react';
import Header from '@/components/layout/Header';

interface MealRecord {
  id: string;
  date: string;
  mealType: string;
  foods: {
    name: string;
    quantity: string;
    unit: string;
    calories: number;
  }[];
  totalCalories: number;
  notes?: string;
  timestamp: string;
}

const ViewRecord: React.FC = () => {
  const { t, language } = useTheme();
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');

  useEffect(() => {
    // Load records from localStorage (demo data)
    const storedRecords = localStorage.getItem('nutrisync-meals');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      // Add some demo data
      const demoRecords: MealRecord[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          mealType: 'breakfast',
          foods: [
            { name: language === 'bn' ? 'ভাত' : 'Rice', quantity: '150', unit: 'grams', calories: 195 },
            { name: language === 'bn' ? 'ডাল' : 'Lentils', quantity: '100', unit: 'grams', calories: 116 },
          ],
          totalCalories: 311,
          notes: language === 'bn' ? 'স্বাস্থ্যকর সকালের নাস্তা' : 'Healthy breakfast',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          mealType: 'lunch',
          foods: [
            { name: language === 'bn' ? 'মাছ (রুই)' : 'Fish (Rohu)', quantity: '200', unit: 'grams', calories: 194 },
            { name: language === 'bn' ? 'ভাত' : 'Rice', quantity: '200', unit: 'grams', calories: 260 },
            { name: language === 'bn' ? 'পালং শাক' : 'Spinach', quantity: '150', unit: 'grams', calories: 35 },
          ],
          totalCalories: 489,
          notes: language === 'bn' ? 'পুষ্টিকর দুপুরের খাবার' : 'Nutritious lunch',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          mealType: 'dinner',
          foods: [
            { name: language === 'bn' ? 'চিকেন' : 'Chicken', quantity: '150', unit: 'grams', calories: 248 },
            { name: language === 'bn' ? 'রুটি' : 'Roti', quantity: '3', unit: 'pieces', calories: 213 },
            { name: language === 'bn' ? 'বেগুন' : 'Eggplant', quantity: '100', unit: 'grams', calories: 25 },
          ],
          totalCalories: 486,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setRecords(demoRecords);
      localStorage.setItem('nutrisync-meals', JSON.stringify(demoRecords));
    }
  }, [language]);

  const filteredRecords = records.filter(record => {
    if (filter !== 'all' && record.mealType !== filter) return false;
    
    const recordDate = new Date(record.date);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return recordDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return recordDate >= monthAgo;
      default:
        return true;
    }
  });

  const totalCalories = filteredRecords.reduce((sum, record) => sum + record.totalCalories, 0);
  const avgCalories = filteredRecords.length > 0 ? Math.round(totalCalories / filteredRecords.length) : 0;

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: language === 'bn' ? 'সকালের নাস্তা' : 'Breakfast',
      lunch: language === 'bn' ? 'দুপুরের খাবার' : 'Lunch',
      dinner: language === 'bn' ? 'রাতের খাবার' : 'Dinner',
      snack: language === 'bn' ? 'নাস্তা' : 'Snack',
    };
    return labels[type] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-primary',
      lunch: 'bg-secondary',
      dinner: 'bg-accent',
      snack: 'bg-highlight text-highlight-foreground',
    };
    return colors[type] || 'bg-muted';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('page.viewRecord')}
            </h1>
            <p className={`text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
              Track your nutrition journey and progress
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'মোট ক্যালোরি' : 'Total Calories'}
                  </p>
                  <p className="text-2xl font-bold text-primary">{totalCalories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'গড় ক্যালোরি' : 'Avg Calories'}
                  </p>
                  <p className="text-2xl font-bold text-secondary">{avgCalories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className={`text-sm text-muted-foreground ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? 'মোট খাবার' : 'Total Meals'}
                  </p>
                  <p className="text-2xl font-bold text-accent">{filteredRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card border-0 shadow-medium">
          <CardHeader>
            <CardTitle className={`flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              {language === 'bn' ? 'ফিল্টার' : 'Filters'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className={`text-sm font-medium mb-2 block ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? 'খাবারের ধরন' : 'Meal Type'}
                </label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব' : 'All'}</SelectItem>
                    <SelectItem value="breakfast">{language === 'bn' ? 'সকালের নাস্তা' : 'Breakfast'}</SelectItem>
                    <SelectItem value="lunch">{language === 'bn' ? 'দুপুরের খাবার' : 'Lunch'}</SelectItem>
                    <SelectItem value="dinner">{language === 'bn' ? 'রাতের খাবার' : 'Dinner'}</SelectItem>
                    <SelectItem value="snack">{language === 'bn' ? 'নাস্তা' : 'Snack'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`text-sm font-medium mb-2 block ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? 'সময়কাল' : 'Time Period'}
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{language === 'bn' ? 'আজ' : 'Today'}</SelectItem>
                    <SelectItem value="week">{language === 'bn' ? 'এই সপ্তাহ' : 'This Week'}</SelectItem>
                    <SelectItem value="month">{language === 'bn' ? 'এই মাস' : 'This Month'}</SelectItem>
                    <SelectItem value="all">{language === 'bn' ? 'সব সময়' : 'All Time'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'কোন রেকর্ড পাওয়া যায়নি' : 'No Records Found'}
              </h3>
              <p className={`text-muted-foreground mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? 'খাবার রেকর্ড করা শুরু করুন' : 'Start recording your meals to see them here'}
              </p>
              <Button asChild className="bg-gradient-primary">
                <Link to="/record-food">
                  {language === 'bn' ? 'খাবার রেকর্ড করুন' : 'Record Food'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="bg-gradient-card border-0 shadow-medium hover:shadow-strong transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getMealTypeColor(record.mealType)} text-white`}>
                        {getMealTypeLabel(record.mealType)}
                      </Badge>
                      <div>
                        <p className="font-semibold">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{record.totalCalories}</p>
                      <p className="text-sm text-muted-foreground">calories</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? 'খাবারের তালিকা:' : 'Foods:'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {record.foods.map((food, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded border">
                          <span className={`text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {food.name} ({food.quantity} {food.unit})
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {food.calories} cal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {record.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className={`text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
                        <strong>{language === 'bn' ? 'নোট:' : 'Notes:'}</strong> {record.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecord;