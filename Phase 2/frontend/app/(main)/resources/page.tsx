"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Filter,
  GraduationCap,
  PlayCircle,
  Search,
  Star,
  Bookmark,
} from "lucide-react";
import ResourceAPI, { Resource } from "@/lib/api/resource";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const types = ["Course", "Interactive", "Video Series", "Practice"];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await ResourceAPI.getResources({
          search: searchQuery,
          level: selectedLevel || undefined,
        });
        setResources(res.data.data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      }
    };

    fetchResources();
  }, [searchQuery, selectedLevel, selectedType]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topic.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = !selectedType || resource.level === selectedType;

    return matchesSearch && matchesType;
  });

  const levelColors = {
    Beginner: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    Intermediate: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    Advanced: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  };

  const typeColors = {
    Course: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
    Interactive: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
    "Video Series": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
    Practice: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-gradient">Learning Resources</span>
        </h1>
        <p className="text-muted-foreground">
          Explore our curated collection of math learning resources
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
            <Input
              placeholder="Search resources..."
              className="pl-8 border-primary/20 focus-visible:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedLevel(selectedLevel === level ? null : level)
                }
                className={
                  selectedLevel === level
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "border-primary/20 hover:border-primary/50 text-primary"
                }
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource, i) => (
            <Card
              key={i}
              onClick={() => {
                window.open(resource.link, "_blank");
              }}
              className="flex flex-col shadow-soft hover-lift overflow-hidden cursor-pointer"
            >
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardHeader className="bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.topic.map((topic, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className={`${typeColors[resource.level as keyof typeof typeColors]}`}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {resource.level}
                    </span>
                    <Badge
                      variant="outline"
                      className={levelColors[resource.level as keyof typeof levelColors]}
                    >
                      {resource.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}