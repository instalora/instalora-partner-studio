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
  Clock,
  ImageIcon,
  FileVideo2,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api-client";

type ApiStatus = "queued" | "in_progress" | "approved" | "rejected" | "done" | "error";
type StatusFilter = ApiStatus | "all";
type TabValue = "all" | "images" | "videos" | "favorites";
type DatePreset = "last_7_days" | "last_30_days" | null;
type SortOrder = "desc" | "asc";

type GenerationModel = {
  id: string;
  name: string;
};

type ApiGenerationItem = {
  id?: string | number;
  output_image_url?: string;
  format?: string;
  model_name?: string;
  campaign_name?: string;
  updated_at?: string;
  save?: boolean;
  favorite?: boolean;
  is_favorite?: boolean;
  status?: string;
};

type ApiGenerationResponse = {
  items?: unknown;
  next_cursor?: unknown;
  has_more?: unknown;
};

type LibraryItem = {
  id: string;
  thumbnail: string;
  format?: string;
  modelName?: string;
  campaignName?: string;
  updatedAt?: string;
  save: boolean;
  status?: string;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "queued", label: "Queued" },
  { value: "in_progress", label: "In progress" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "done", label: "Done" },
  { value: "error", label: "Error" },
];

const statusLabels: Record<ApiStatus, string> = {
  queued: "Queued",
  in_progress: "In progress",
  approved: "Approved",
  rejected: "Rejected",
  done: "Done",
  error: "Error",
};

const PAGE_SIZE = 20;

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [generationModels, setGenerationModels] = useState<GenerationModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [datePreset, setDatePreset] = useState<DatePreset>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiBaseUrl = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL as string | undefined ?? "https://api.epictwin.co").replace(/\/$/, ""),
    [],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchGenerationModels = useCallback(async () => {
    setIsLoadingModels(true);
    setModelsError(null);

    try {
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
    } catch (fetchError) {
      setModelsError(fetchError instanceof Error ? fetchError.message : "Failed to load models");
    } finally {
      setIsLoadingModels(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchGenerationModels();
  }, [fetchGenerationModels]);

  const parseLibraryItems = useCallback((items: unknown): LibraryItem[] => {
    if (!Array.isArray(items)) return [];

    return items
      .map((rawItem) => {
        if (typeof rawItem !== "object" || rawItem === null) return null;
        const { id, output_image_url, format, model_name, campaign_name, updated_at, save, favorite, is_favorite, status } = rawItem as ApiGenerationItem;

        if (id === undefined || id === null) return null;

        const saveValue = Boolean(save ?? favorite ?? is_favorite ?? false);

        return {
          id: String(id),
          thumbnail: typeof output_image_url === "string" ? output_image_url : "",
          format,
          modelName: model_name,
          campaignName: campaign_name,
          updatedAt: updated_at,
          save: saveValue,
          status,
        };
      })
      .filter((item): item is LibraryItem => Boolean(item));
  }, []);

  const fetchLibraryItems = useCallback(
    async ({ cursor, append }: { cursor?: string; append?: boolean } = {}) => {
      const shouldAppend = Boolean(append);
      setError(null);
      if (shouldAppend) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_SIZE));
        params.set("sort", sortOrder === "desc" ? "-updated_at" : "updated_at");

        if (cursor) {
          params.set("cursor", cursor);
        }

        if (datePreset && datePreset !== "all_time") {
          params.set("updated_at_preset", datePreset);
        }

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        if (modelFilter !== "all") {
          params.set("model_ids", modelFilter);
        }

        if (debouncedSearchTerm.trim()) {
          params.set("search", debouncedSearchTerm.trim());
        }

        if (activeTab === "images") {
          params.set("format", "image");
        }

        if (activeTab === "videos") {
          params.set("format", "video");
        }

        if (activeTab === "favorites") {
          params.set("save", "1");
        }

        const response = await fetchWithAuth(`${apiBaseUrl}/v1.0/generations/content?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load content");
        }

        const data: ApiGenerationResponse = await response.json();
        const parsedItems = parseLibraryItems(data.items);
        const nextCursorValue = typeof data.next_cursor === "string" ? data.next_cursor : null;
        const hasMoreValue = Boolean(data.has_more);

        setLibraryItems((prev) => (shouldAppend ? [...prev, ...parsedItems] : parsedItems));
        setNextCursor(nextCursorValue);
        setHasMore(hasMoreValue);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load content");
        if (!shouldAppend) {
          setLibraryItems([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [activeTab, apiBaseUrl, datePreset, debouncedSearchTerm, modelFilter, parseLibraryItems, sortOrder, statusFilter],
  );

  useEffect(() => {
    setSelectedItems([]);
    setLibraryItems([]);
    setNextCursor(null);
    setHasMore(false);
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const selectAll = () => {
    const visibleIds = libraryItems.map((item) => item.id);
    setSelectedItems((prev) => (prev.length === visibleIds.length ? [] : visibleIds));
  };

  const selectedModelLabel = useMemo(() => {
    if (modelFilter === "all") return "All models";
    const matchedModel = generationModels.find((model) => model.id === modelFilter);
    return matchedModel?.name ?? modelFilter;
  }, [generationModels, modelFilter]);

  const datePresetLabel = useMemo(() => {
    switch (datePreset) {
      case "last_7_days":
        return "Last 7 days";
      case "last_30_days":
        return "Last 30 days";
      default:
        return null;
    }
  }, [datePreset]);

  const renderItems = (items: LibraryItem[]) =>
    viewMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <LibraryGridItem
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={() => toggleItemSelection(item.id)}
            onDelete={handleDeleteItem}
            deletingId={deletingId}
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
            onDelete={handleDeleteItem}
            deletingId={deletingId}
          />
        ))}
      </div>
    );

  const renderContent = () => {
    if (isLoading && libraryItems.length === 0) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground mt-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading content...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-destructive mt-6 bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      );
    }

    if (!isLoading && libraryItems.length === 0) {
      return (
        <div className="text-muted-foreground mt-6">No content found. Try adjusting your filters.</div>
      );
    }

    return (
      <div className="space-y-6">
        {renderItems(libraryItems)}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => nextCursor && fetchLibraryItems({ cursor: nextCursor, append: true })}
              disabled={isLoadingMore || !nextCursor}
            >
              {isLoadingMore && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Load more
            </Button>
          </div>
        )}
      </div>
    );
  };

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (!id) {
        setError("Unable to delete this generation because its ID is missing.");
        return;
      }

      setError(null);
      setDeletingId(id);

      try {
        const response = await fetchWithAuth(`${apiBaseUrl}/v1.0/generations/${encodeURIComponent(id)}`, {
          method: "DELETE",
        });

        if (response.status === 204) {
          setLibraryItems((prev) => prev.filter((item) => item.id !== id));
          setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
          return;
        }

        if (response.status === 403) {
          throw new Error("You do not have permission to delete this generation.");
        }

        if (response.status === 404) {
          setLibraryItems((prev) => prev.filter((item) => item.id !== id));
          setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
          return;
        }

        throw new Error("Failed to delete generation. Please try again.");
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : "Failed to delete generation. Please try again.");
      } finally {
        setDeletingId(null);
      }
    },
    [apiBaseUrl],
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
          <Button className="bg-cta hover:bg-cta-600" onClick={() => (window.location.href = "/generator")}>
            Generate New Content
          </Button>
        </div>

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
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                  <DropdownMenuItem onSelect={() => setSortOrder("desc")}>Newest first</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortOrder("asc")}>Oldest first</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setDatePreset("last_7_days")}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setDatePreset("last_30_days")}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setDatePreset(null)}>All time</DropdownMenuItem>
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
                  {isLoadingModels && <DropdownMenuItem disabled>Loading models...</DropdownMenuItem>}
                  {modelsError && (
                    <DropdownMenuItem disabled className="text-destructive">
                      {modelsError}
                    </DropdownMenuItem>
                  )}
                  {!isLoadingModels && !modelsError &&
                    generationModels.map((model) => (
                      <DropdownMenuItem key={model.id} onSelect={() => setModelFilter(model.id)}>
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
              Status: {statusOptions.find((option) => option.value === statusFilter)?.label ?? "All"}
            </Button>
            {modelFilter !== "all" && (
              <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
                <Users className="h-3 w-3 mr-1" />
                Model: {selectedModelLabel}
              </Button>
            )}
            {datePresetLabel && (
              <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
                <Calendar className="h-3 w-3 mr-1" />
                {datePresetLabel}
              </Button>
            )}
            {debouncedSearchTerm && (
              <Button size="sm" variant="outline" className="h-7 px-2 rounded-full">
                <Search className="h-3 w-3 mr-1" />
                "{debouncedSearchTerm}"
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
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
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path d="M1.5 1H6.5V6H1.5V1ZM8.5 1H13.5V6H8.5V1ZM1.5 8H6.5V13H1.5V8ZM8.5 8H13.5V13H8.5V8Z" stroke="currentColor" strokeWidth="1" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(viewMode === "list" ? "bg-accent" : "")}
                onClick={() => setViewMode("list")}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path d="M1.5 2H13.5M1.5 7.5H13.5M1.5 13H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Button>

              <div className="w-px h-6 bg-border mx-1"></div>

              <Button variant={selectedItems.length > 0 ? "default" : "outline"} size="sm" onClick={selectAll}>
                {selectedItems.length === libraryItems.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>

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
            {renderContent()}
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            {renderContent()}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            {renderContent()}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface LibraryItemProps {
  item: LibraryItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const LibraryGridItem = ({ item, isSelected, onSelect, onDelete, deletingId }: LibraryItemProps) => {
  const isVideo = item.format?.toLowerCase() === "video";
  const statusLabel = item.status && statusLabels[item.status as ApiStatus];
  const thumbnail = item.thumbnail || "/placeholder.svg";
  const isDeleting = deletingId === item.id;

  return (
    <div
      className={cn(
        "bg-card rounded-lg shadow-card overflow-hidden transition-all duration-200",
        isSelected ? "ring-2 ring-primary" : "hover:shadow-card-hover",
      )}
    >
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 bg-black/50 backdrop-blur-md border-none hover:bg-black/70"
            onClick={onSelect}
          >
            <input type="checkbox" checked={isSelected} onChange={onSelect} className="h-4 w-4" />
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
                <Heart className={cn("h-4 w-4 mr-2", item.save ? "fill-red-500 text-red-500" : "")} />
                {item.save ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={isDeleting}
                onSelect={(event) => {
                  event.preventDefault();
                  if (!isDeleting) {
                    onDelete(item.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute top-2 left-2 z-10">
          <Button variant="secondary" size="icon" className="h-7 w-7 bg-black/50 backdrop-blur-md border-none">
            {isVideo ? <FileVideo2 className="h-4 w-4 text-white" /> : <ImageIcon className="h-4 w-4 text-white" />}
          </Button>
        </div>

        <img src={thumbnail} alt={item.campaignName ?? "Content thumbnail"} className="w-full h-56 object-cover" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium line-clamp-2 flex-1">{item.campaignName ?? "Untitled content"}</h3>
          {item.save && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
          <Users className="h-3 w-3" />
          <span className="truncate">{item.modelName ?? "Unknown model"}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
          <Clock className="h-3 w-3" />
          <span>{formatDate(item.updatedAt)}</span>
        </div>

        {statusLabel && (
          <span className="inline-flex items-center text-xs bg-accent px-2 py-0.5 rounded-full text-foreground/80">
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
};

const LibraryListItem = ({ item, isSelected, onSelect, onDelete, deletingId }: LibraryItemProps) => {
  const isVideo = item.format?.toLowerCase() === "video";
  const statusLabel = item.status && statusLabels[item.status as ApiStatus];
  const thumbnail = item.thumbnail || "/placeholder.svg";
  const isDeleting = deletingId === item.id;

  return (
    <div
      className={cn(
        "bg-card rounded-lg shadow-card overflow-hidden flex transition-all duration-200",
        isSelected ? "ring-2 ring-primary" : "hover:shadow-card-hover",
      )}
    >
      <div className="relative h-24 w-24 shrink-0">
        <img src={thumbnail} alt={item.campaignName ?? "Content thumbnail"} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          {isVideo && (
            <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
              <FileVideo2 className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 flex-1 min-w-0 flex flex-col justify-center gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-1 flex-1">{item.campaignName ?? "Untitled content"}</h3>
          {item.save && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1 flex-wrap gap-x-2 gap-y-1">
          <span className="flex items-center gap-1 min-w-0">
            <Users className="h-3 w-3" /> <span className="truncate">{item.modelName ?? "Unknown model"}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatDate(item.updatedAt)}
          </span>
          {statusLabel && <span className="text-xs bg-accent px-1.5 py-0.5 rounded-full">{statusLabel}</span>}
        </div>
      </div>

      <div className="p-3 flex items-center gap-2">
        <input type="checkbox" checked={isSelected} onChange={onSelect} className="h-4 w-4" />
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
              <Heart className={cn("h-4 w-4 mr-2", item.save ? "fill-red-500 text-red-500" : "")} />
              {item.save ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              disabled={isDeleting}
              onSelect={(event) => {
                event.preventDefault();
                if (!isDeleting) {
                  onDelete(item.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Library;
