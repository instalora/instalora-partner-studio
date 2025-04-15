
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/models/ModelCard";
import { Search, SlidersHorizontal, Filter } from "lucide-react";

// Mock data for models
const mockModels = [
  {
    id: "1",
    name: "Sophia",
    image: "https://source.unsplash.com/random/400x600?portrait&woman&sig=1",
    category: "Fashion",
    rating: 4.8,
    likes: 1245,
  },
  {
    id: "2",
    name: "Marcus",
    image: "https://source.unsplash.com/random/400x600?portrait&man&sig=2",
    category: "Fitness",
    rating: 4.6,
    likes: 982,
  },
  {
    id: "3",
    name: "Aisha",
    image: "https://source.unsplash.com/random/400x600?portrait&woman&sig=3",
    category: "Beauty",
    rating: 4.9,
    likes: 1532,
  },
  {
    id: "4",
    name: "Jackson",
    image: "https://source.unsplash.com/random/400x600?portrait&man&sig=4",
    category: "Lifestyle",
    rating: 4.5,
    likes: 876,
  },
  {
    id: "5",
    name: "Elena",
    image: "https://source.unsplash.com/random/400x600?portrait&woman&sig=5",
    category: "Fashion",
    rating: 4.7,
    likes: 1123,
  },
  {
    id: "6",
    name: "Michael",
    image: "https://source.unsplash.com/random/400x600?portrait&man&sig=6",
    category: "Fitness",
    rating: 4.4,
    likes: 754,
  },
];

// Categories for filtering
const categories = ["All", "Fashion", "Fitness", "Beauty", "Lifestyle", "Travel"];

const Models = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Filter models based on search term and category
  const filteredModels = mockModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <SectionHeader
          title="AI Model Explorer"
          description="Browse and select from our curated collection of AI models for your content generation"
        />

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-cta hover:bg-cta-600">
              <Filter className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-primary" : ""}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Models grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              image={model.image}
              category={model.category}
              rating={model.rating}
              likes={model.likes}
            />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Models;
