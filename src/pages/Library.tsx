
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  Users,
  TagIcon,
  Clock,
  ImageIcon,
  FileVideo2,
  Heart
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api-client";

type LibraryStatus = "approved" | "rejected" | "pending";
type StatusFilter = LibraryStatus | "all";
type GenerationModel = {
  id: string;
  name: string;
};

// Mock library data
const mockLibraryItems = [
  {
    id: "1",
    type: "image",
    thumbnail: "https://source.unsplash.com/random/600x800?fashion&woman&sig=1",
    title: "Summer beach outfit",
    model: "Sophia",
    date: "2023-05-15T12:00:00Z",
    tags: ["summer", "beach", "fashion"],
    liked: true,
    status: "approved" as LibraryStatus,
  },
  {
    id: "2",
    type: "image",
    thumbnail: "https://source.unsplash.com/random/600x800?fitness&woman&sig=2",
    title: "Workout gear promotion",
    model: "Aisha",
    date: "2023-05-10T09:30:00Z",
    tags: ["fitness", "workout", "athleisure"],
    liked: false,
    status: "pending" as LibraryStatus,
  },
  {
    id: "3",
    type: "video",
    thumbnail: "https://source.unsplash.com/random/600x800?lifestyle&man&sig=3",
    title: "Coffee shop casual",
    model: "Marcus",
    date: "2023-05-08T14:15:00Z",
    tags: ["lifestyle", "casual", "urban"],
    liked: true,
    status: "approved" as LibraryStatus,
  },
  {
    id: "4",
    type: "image",
    thumbnail: "https://source.unsplash.com/random/600x800?beauty&woman&sig=4",
    title: "Skincare routine",
    model: "Elena",
    date: "2023-05-05T11:45:00Z",
    tags: ["beauty", "skincare", "wellness"],
    liked: false,
    status: "rejected" as LibraryStatus,
  },
  {
    id: "5",
    type: "video",
    thumbnail: "https://source.unsplash.com/random/600x800?travel&man&sig=5",
    title: "Travel backpack review",
    model: "Jackson",
    date: "2023-05-02T16:20:00Z",
    tags: ["travel", "gear", "review"],
    liked: true,
    status: "pending" as LibraryStatus,
  },
  {
    id: "6",
    type: "image",
    thumbnail: "https://source.unsplash.com/random/600x800?fashion&woman&sig=6",
    title: "Evening gown collection",
    model: "Sophia",
    date: "2023-04-28T18:30:00Z",
    tags: ["fashion", "evening", "luxury"],
    liked: true,
    status: "approved" as LibraryStatus,
  },
];

// Helper function to format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [generationModels, setGenerationModels] = useState<GenerationModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  const fetchGenerationModels = useCallback(async () => {
    setIsLoadingModels(true);
    setModelsError(null);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined ?? "https://api.epictwin.co").replace(/\/$/, "");
      const response = await fetchWithAuth(`${apiBaseUrl}/v1.0/generations/models`);

      if (!response.ok) {
        throw new Error("Failed to load models");
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      const parsedModels = data
        .map((item) => {
          if (typeof item !== "object" || item === null) return null;
          const { id, name } = item as { id?: string | number; name?: string };
          if (id === undefined || id === null) return null;
          return { id: String(id), name: name ?? String(id) };
        })
        .filter((item): item is GenerationModel => Boolean(item));

      const uniqueModels = Array.from(new Map(parsedModels.map((model) => [model.id, model])).values());

      setGenerationModels(uniqueModels);
    } catch (error) {
      setModelsError(error instanceof Error ? error.message : "Failed to load models");
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  useEffect(() => {
    fetchGenerationModels();
  }, [fetchGenerationModels]);
  
  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const selectAll = () => {
    if (selectedItems.length === mockLibraryItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockLibraryItems.map(item => item.id));
    }
  };

  const filteredItems = mockLibraryItems.filter((item) => {
    const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
    const matchesModel = modelFilter === "all" ? true : item.model === modelFilter;
    return matchesStatus && matchesModel;
  });
  const imageItems = filteredItems.filter((item) => item.type === "image");
  const videoItems = filteredItems.filter((item) => item.type === "video");
  const favoriteItems = filteredItems.filter((item) => item.liked);
  const selectedModelLabel = useMemo(() => {
    if (modelFilter === "all") return "All models";
    const matchedModel = generationModels.find((model) => model.name === modelFilter);
    return matchedModel?.name ?? modelFilter;
  }, [generationModels, modelFilter]);

  const renderItems = (items: typeof mockLibraryItems) => (
    viewMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <LibraryGridItem 
            key={item.id} 
            item={item} 
            isSelected={selectedItems.includes(item.id)} 
            onSelect={() => toggleItemSelection(item.id)} 
          />
        ))}
      </div>
    ) : (
      <div className="space-y-2">
        {items.map((item) => (
          <LibraryListItem 
            key={item.id} 
            item={item} 
            isSelected={selectedItems.includes(item.id)} 
            onSelect={() => toggleItemSelection(item.id)} 
          />
        ))}
      </div>
    )
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionHeader
            title="Content Library"
            description="Browse and manage your generated content"
            className="mb-0"
          />
          <Button 
            className="bg-cta hover:bg-cta-600"
            onClick={() => window.location.href = "/generator"}
          >
            Generate New Content
          </Button>
        </div>

        {/* Filters and actions */}
        <div className="bg-card rounded-lg shadow-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="min-w-[160px]">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Newest first</DropdownMenuItem>
                  <DropdownMenuItem>Oldest first</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>All time</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Models
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setModelFilter("all")}>All models</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isLoadingModels && (
                    <DropdownMenuItem disabled>Loading models...</DropdownMenuItem>
                  )}
                  {modelsError && (
                    <DropdownMenuItem disabled className="text-destructive">
                      {modelsError}
                    </DropdownMenuItem>
                  )}
                  {!isLoadingModels && !modelsError && generationModels.map((model) => (
                    <DropdownMenuItem key={model.id} onSelect={() => setModelFilter(model.name)}>
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                  {!isLoadingModels && !modelsError && generationModels.length === 0 && (
                    <DropdownMenuItem disabled>No models available</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <Filter className="h-3 w-3 mr-1" />
              Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Button>
            {modelFilter !== "all" && (
              <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
                <Users className="h-3 w-3 mr-1" />
                Model: {selectedModelLabel}
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <TagIcon className="h-3 w-3 mr-1" />
              summer
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <TagIcon className="h-3 w-3 mr-1" />
              fashion
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <TagIcon className="h-3 w-3 mr-1" />
              fitness
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <TagIcon className="h-3 w-3 mr-1" />
              lifestyle
            </Button>
            <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
              <TagIcon className="h-3 w-3 mr-1" />
              beauty
            </Button>
          </div>
        </div>

        {/* Content tabs and display */}
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(viewMode === "grid" ? "bg-accent" : "")}
                onClick={() => setViewMode("grid")}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M1.5 1H6.5V6H1.5V1ZM8.5 1H13.5V6H8.5V1ZM1.5 8H6.5V13H1.5V8ZM8.5 8H13.5V13H8.5V8Z" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(viewMode === "list" ? "bg-accent" : "")}
                onClick={() => setViewMode("list")}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M1.5 2H13.5M1.5 7.5H13.5M1.5 13H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Button>
              
              <div className="w-px h-6 bg-border mx-1"></div>
              
              <Button 
                variant={selectedItems.length > 0 ? "default" : "outline"} 
                size="sm"
                onClick={selectAll}
              >
                {selectedItems.length === mockLibraryItems.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>

          {/* Selected items actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-2 bg-accent rounded-md">
              <span className="text-sm font-medium ml-2">
                {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <TabsContent value="all" className="mt-6">
            {renderItems(filteredItems)}
          </TabsContent>
          
          <TabsContent value="images" className="mt-6">
            {renderItems(imageItems)}
          </TabsContent>
          
          <TabsContent value="videos" className="mt-6">
            {renderItems(videoItems)}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            {renderItems(favoriteItems)}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Grid item component
interface LibraryItemProps {
  item: typeof mockLibraryItems[0];
  isSelected: boolean;
  onSelect: () => void;
}

const LibraryGridItem = ({ item, isSelected, onSelect }: LibraryItemProps) => {
  return (
    <div className={cn(
      "bg-card rounded-lg shadow-card overflow-hidden transition-all duration-200",
      isSelected ? "ring-2 ring-primary" : "hover:shadow-card-hover"
    )}>
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-7 w-7 bg-black/50 backdrop-blur-md border-none hover:bg-black/70"
            onClick={onSelect}
          >
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={onSelect} 
              className="h-4 w-4"
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-7 w-7 bg-black/50 backdrop-blur-md border-none hover:bg-black/70"
              >
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className={cn("h-4 w-4 mr-2", item.liked ? "fill-red-500 text-red-500" : "")} />
                {item.liked ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="absolute top-2 left-2 z-10">
          {item.type === "video" ? (
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 bg-black/50 backdrop-blur-md border-none"
            >
              <FileVideo2 className="h-4 w-4 text-white" />
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 bg-black/50 backdrop-blur-md border-none"
            >
              <ImageIcon className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>
        
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-56 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{item.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
          <Users className="h-3 w-3" />
          <span>{item.model}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <Clock className="h-3 w-3" />
          <span>{formatDate(item.date)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {item.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs bg-accent px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// List item component
const LibraryListItem = ({ item, isSelected, onSelect }: LibraryItemProps) => {
  return (
    <div className={cn(
      "bg-card rounded-lg shadow-card overflow-hidden flex transition-all duration-200",
      isSelected ? "ring-2 ring-primary" : "hover:shadow-card-hover"
    )}>
      <div className="relative h-24 w-24 shrink-0">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {item.type === "video" && (
            <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
              <FileVideo2 className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-medium line-clamp-1">{item.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1 flex-wrap gap-x-2 gap-y-1">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {item.model}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatDate(item.date)}
          </span>
          <div className="flex gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-accent px-1.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs bg-accent px-1.5 py-0.5 rounded-full">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={onSelect} 
          className="h-4 w-4"
        />
        {item.liked && (
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className={cn("h-4 w-4 mr-2", item.liked ? "fill-red-500 text-red-500" : "")} />
              {item.liked ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Library;
