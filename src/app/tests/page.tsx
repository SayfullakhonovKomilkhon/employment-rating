"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, Play, Clock, HelpCircle, Tag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTests } from "@/hooks/useTests";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const difficultyColors = {
  "Легкий": "bg-green-100 text-green-800 border-green-200",
  "Средний": "bg-yellow-100 text-yellow-800 border-yellow-200", 
  "Сложный": "bg-red-100 text-red-800 border-red-200"
};

export default function TestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const router = useRouter();
  const { activeTests } = useTests();

  // Get unique categories for filtering
  const categories = Array.from(new Set(activeTests.map(test => test.category)));

  // Filter tests based on search term, category, and difficulty
  const filteredTests = activeTests.filter((test) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (
      test.title.toLowerCase().includes(q) ||
      test.description.toLowerCase().includes(q) ||
      test.category.toLowerCase().includes(q) ||
      test.tags.some(tag => tag.toLowerCase().includes(q))
    );
    
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || test.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleLogout = () => {
    router.push("/login");
  };

  const handleTakeTest = (testId: number) => {
    // In a real app, this would navigate to the test taking interface
    // For now, navigate to a placeholder or show a toast notification
    router.push(`/tests/${testId}/take`);
  };

  const handleTestDetails = (testId: number) => {
    // In a real app, this would navigate to detailed test information
    router.push(`/tests/${testId}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2 flex-1">
              <div className="md:hidden w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">ER</span>
              </div>
              <h1 className="text-lg font-semibold md:text-xl">Тесты</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/40">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск по названию, описанию или тегам..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] h-12">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[160px] h-12">
                      <SelectValue placeholder="Сложность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все уровни</SelectItem>
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
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg leading-tight">{test.title}</CardTitle>
                        <Badge 
                          variant="outline"
                          className={difficultyColors[test.difficulty]}
                        >
                          {test.difficulty}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {test.category}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {test.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.duration} мин</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          <span>{test.questionsCount} вопросов</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {test.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {test.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{test.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => handleTakeTest(test.id)}
                          className="flex-1 flex items-center gap-2"
                          size="sm"
                        >
                          <Play className="w-4 h-4" />
                          Пройти
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleTestDetails(test.id)}
                          size="sm"
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
                  <p className="text-muted-foreground text-lg">Тесты не найдены по выбранным критериям.</p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
