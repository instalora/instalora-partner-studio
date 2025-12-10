
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/models/ModelCard";
import { Search, SlidersHorizontal, Filter } from "lucide-react";

type ModelResponseItem = {
  id: string | number;
  name: string;
  list_image_url?: string;
  category_name?: string;
  rating?: number;
  like_count?: number;
  audience_count?: number;
  is_favorite?: boolean;
};

type ModelsResponse = {
  items?: ModelResponseItem[];
  next_cursor?: string | null;
  has_more?: boolean;
};

type Model = {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  likes: number;
  audienceCount: number;
  isFavorite: boolean;
};

const mapResponseToModels = (items: ModelResponseItem[]): Model[] =>
  items.map((item) => ({
    id: String(item.id),
    name: item.name ?? "Unnamed Model",
    image: item.list_image_url ?? "",
    category: item.category_name ?? "Uncategorized",
    rating: item.rating ?? 0,
    likes: item.like_count ?? 0,
    audienceCount: item.audience_count ?? 0,
    isFavorite: Boolean(item.is_favorite),
  }));

const Models = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchModels = useCallback(async (cursor?: string) => {
    setError(null);
    if (cursor) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const url = cursor
        ? `/v1.0/models?cursor=${encodeURIComponent(cursor)}`
        : "/v1.0/models";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      const data: ModelsResponse & { items?: ModelResponseItem[]; data?: ModelResponseItem[] } =
        await response.json();
      const items =
        (Array.isArray(data?.items) && data.items) ||
        (Array.isArray(data?.data) && data.data) ||
        [];

      const mappedModels = mapResponseToModels(items);

      setModels((prev) => (cursor ? [...prev, ...mappedModels] : mappedModels));
      setNextCursor(data?.next_cursor ?? null);
      setHasMore(Boolean(data?.has_more));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(models.map((model) => model.category).filter(Boolean))),
    ],
    [models]
  );

  // Filter models based on search term and category
  const filteredModels = models.filter((model) => {
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

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fetchModels()}
            >
              Retry
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">Loading models...</div>
        )}

        {!isLoading && !error && models.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models available right now.</p>
            <Button className="mt-4" variant="outline" onClick={() => fetchModels()}>
              Reload
            </Button>
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
              audienceCount={model.audienceCount}
              isFavorite={model.isFavorite}
            />
          ))}
        </div>

        {filteredModels.length === 0 && models.length > 0 && !isLoading && !error && (
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

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button onClick={() => fetchModels(nextCursor ?? undefined)} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Models;
