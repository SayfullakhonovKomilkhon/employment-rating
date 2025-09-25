"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTests } from "@/hooks/useTests";
import { AppLayout } from "@/components/AppLayout";

const difficultyColors = {
  "Легкий": "bg-green-100 text-green-800 border-green-300",
  "Средний": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Сложный": "bg-red-100 text-red-800 border-red-300",
};

const difficultyLabels = {
  "Легкий": "Легкий",
  "Средний": "Средний", 
  "Сложный": "Сложный",
};

export default function TestsPage() {
  const router = useRouter();
  const { tests } = useTests();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const handleTakeTest = (testId: number) => {
    // In a real app, this would navigate to the test taking interface
    // For now, navigate to a placeholder or show a toast notification
    router.push(`/tests/${testId}/take`);
  };

  const handleTestDetails = (testId: number) => {
    // In a real app, this would navigate to detailed test information
    router.push(`/tests/${testId}`);
  };

  // Get unique categories
  const categories = Array.from(new Set(tests.map(test => test.category)));

  // Filter tests
  const filteredTests = tests.filter(test => {
    const categoryMatch = selectedCategory === "all" || test.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || test.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <AppLayout pageTitle="Тесты" activeSection="tests">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Фильтры:</span>
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Сложность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Вся сложность</SelectItem>
                <SelectItem value="Легкий">Легкий</SelectItem>
                <SelectItem value="Средний">Средний</SelectItem>
                <SelectItem value="Сложный">Сложный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg text-foreground">{test.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${difficultyColors[test.difficulty]} font-medium`}
                  >
                    {difficultyLabels[test.difficulty]}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground line-clamp-3">
                  {test.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Время: {test.duration} мин</span>
                  <span>Вопросов: {test.questionsCount}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {test.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {test.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {test.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{test.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleTakeTest(test.id)}
                    className="flex-1"
                  >
                    Пройти тест
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleTestDetails(test.id)}
                    className="px-4"
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Тесты не найдены по выбранным фильтрам.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}