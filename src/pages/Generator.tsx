
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Image,
  Upload,
  Sparkles,
  Clock,
  Download, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Heart,
  ImagePlus,
  FileVideo2,
  RefreshCw,
  Trash2
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type ApiModel = {
  id?: string;
  name?: string;
  list_image_url?: string;
  category_name?: string;
  supports_image?: boolean;
  supports_video?: boolean;
};

type ModelInfo = {
  id: string;
  name: string;
  image: string;
  category: string;
  supportsImage: boolean;
  supportsVideo: boolean;
};

const normalizeModel = (data: ApiModel | null | undefined): ModelInfo => ({
  id: data?.id ?? "",
  name: data?.name ?? "Unknown Model",
  image: data?.list_image_url ?? "https://source.unsplash.com/random/400x600?portrait&woman&sig=1",
  category: data?.category_name ?? "Uncategorized",
  supportsImage: data?.supports_image ?? true,
  supportsVideo: data?.supports_video ?? false,
});

type GenerationAsset = {
  url?: string;
  asset_url?: string;
  preview_url?: string;
  output_image_url?: string;
  output_video_url?: string;
  status?: string;
};

type GenerationItem = {
  id?: string;
  asset_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  preview_url?: string;
  assets?: GenerationAsset[];
  model_img_url?: string;
  model_name?: string;
  created_at?: string;
  prompt?: string;
  status?: string;
};

const getGenerationAssetUrl = (item: GenerationItem): string | null => {
  const primaryUrl = item.preview_url
    ?? item.thumbnail_url
    ?? item.image_url
    ?? item.asset_url;

  if (primaryUrl) return primaryUrl;

  const previewFromAssets = item.assets?.find((asset) => asset.preview_url)?.preview_url;
  if (previewFromAssets) return previewFromAssets;

  const assetUrl = item.assets?.find((asset) => asset.url || asset.asset_url);
  return assetUrl?.url ?? assetUrl?.asset_url ?? null;
};

const formatDateTime = (value?: string): string => {
  if (!value) return "Unknown date";

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? "Unknown date"
    : parsedDate.toLocaleString();
};

const truncateText = (text: string | undefined, maxLength = 140): string => {
  if (!text) return "No prompt provided";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

const Generator = () => {
  const [searchParams] = useSearchParams();
  const modelSlug = searchParams.get("model")?.trim();

  const [model, setModel] = useState<ModelInfo>(normalizeModel(null));
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelImageLoading, setIsModelImageLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(true);
  const [generationItems, setGenerationItems] = useState<GenerationItem[]>([]);
  const [resultsCursor, setResultsCursor] = useState<string | null>(null);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<{ url: string; label?: string } | null>(null);
  const [favoriteAssets, setFavoriteAssets] = useState<Set<string>>(new Set());
  const [removedAssets, setRemovedAssets] = useState<Set<string>>(new Set());
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [creativityLevel, setCreativityLevel] = useState(50);

  const apiBaseUrl = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL as string | undefined
      ?? "https://api-3mtz.onrender.com").replace(/\/$/, ""),
    []
  );

  const generationsArchiveEndpoint = "https://api.epictwin.co/v1.0/generations";

  useEffect(() => {
    setIsModelImageLoading(Boolean(model.image));
  }, [model.image]);

  useEffect(() => {
    const fetchModel = async () => {
      if (!modelSlug) {
        setModel(normalizeModel(null));
        return;
      }

      setIsModelLoading(true);

      try {
        const response = await fetchWithAuth(`${apiBaseUrl}/v1.0/models/${encodeURIComponent(modelSlug)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch model");
        }

        const data: ApiModel = await response.json();
        setModel(normalizeModel(data));
      } catch (error) {
        console.error("Failed to load model", error);
        setModel(normalizeModel(null));
      } finally {
        setIsModelLoading(false);
      }
    };

    fetchModel();
  }, [apiBaseUrl, modelSlug]);

  useEffect(() => {
    if (!model.supportsVideo && format === "video") {
      setFormat("image");
    }
  }, [format, model.supportsVideo]);

  const fetchGenerations = useCallback(async (cursor?: string) => {
    setIsResultsLoading(true);
    setResultsError(null);

    try {
      const url = new URL(generationsArchiveEndpoint);

      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }

      const response = await fetchWithAuth(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch generations");
      }

      const data = await response.json();
      const items = Array.isArray(data?.items) ? data.items : [];

      setGenerationItems((previous) => (cursor ? [...previous, ...items] : items));
      setResultsCursor(data?.next_cursor ?? null);
    } catch (err) {
      console.error("Failed to load generations", err);
      setResultsError(err instanceof Error ? err.message : "Unable to load generations");

      if (!cursor) {
        setGenerationItems([]);
        setResultsCursor(null);
      }
    } finally {
      setIsResultsLoading(false);
    }
  }, [generationsArchiveEndpoint]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGenerationItems([]);
    setResultsCursor(null);
    setResultsError(null);
    setShowResults(false);
    setSelectedAsset(null);

    try {
      const response = await fetchWithAuth(`${apiBaseUrl}/v1.0/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          model_id: model.id,
          format,
          prompt: prompt.trim(),
          additional_prompt: additionalPrompt.trim(),
          creativity_level: String(creativityLevel),
          generation_count: quantity,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to start generation");
      }

      const data = await response.json();
      setShowResults(true);
    } catch (err) {
      console.error("Generation failed", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setShowResults(false);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!showResults) return;

    fetchGenerations();
  }, [fetchGenerations, showResults]);

  const normalizeAssets = useCallback((item: GenerationItem): GenerationAsset[] => {
    if (Array.isArray(item.assets) && item.assets.length > 0) return item.assets;

    const fallbackUrl = getGenerationAssetUrl(item);
    return fallbackUrl
      ? [{
          id: item.id,
          output_image_url: fallbackUrl,
          preview_url: item.preview_url ?? item.thumbnail_url ?? item.image_url,
          status: item.status,
        }]
      : [];
  }, []);

  const hasGenerationAssets = useMemo(
    () => generationItems.some((item) => normalizeAssets(item).some((asset) => Boolean(asset.output_image_url))),
    [generationItems, normalizeAssets]
  );

  const hasPendingAssets = useMemo(
    () => generationItems.some((item) => normalizeAssets(item).some((asset) => {
      const status = (asset.status ?? item.status ?? "").toLowerCase();
      return status === "queued" || status === "processing";
    })),
    [generationItems, normalizeAssets]
  );

  useEffect(() => {
    if (!showResults || !hasPendingAssets) return;

    const interval = window.setInterval(() => {
      fetchGenerations();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [fetchGenerations, hasPendingAssets, showResults]);

  const handleDownloadAsset = (url: string, filename?: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? "generation";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadAll = () => {
    if (!hasGenerationAssets) return;

    generationItems.forEach((item, index) => {
      const assets = normalizeAssets(item);

      assets.forEach((asset, assetIndex) => {
        const url = asset.output_image_url;
        if (!url) return;

        handleDownloadAsset(url, `generation-${item.id ?? index + 1}-${asset.id ?? assetIndex + 1}`);
      });
    });
  };

  const handleToggleFavorite = (url: string) => {
    setFavoriteAssets((previous) => {
      const next = new Set(previous);

      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }

      return next;
    });
  };

  const handleLoadMoreResults = () => {
    if (!resultsCursor) return;

    fetchGenerations(resultsCursor);
  };

  const handleRemoveAsset = (url?: string) => {
    if (!url) return;

    setRemovedAssets((previous) => {
      const next = new Set(previous);
      next.add(url);
      return next;
    });

    if (selectedAsset?.url === url) {
      setSelectedAsset(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="AI Content Generator"
          description="Create custom UGC-style images and videos with our AI models"
        />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column - Generator controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selected model info */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                {isModelImageLoading ? <Skeleton className="absolute inset-0 h-full w-full" /> : null}

                <img
                  src={model?.image}
                  alt={model?.name}
                  className={cn(
                    "h-16 w-16 rounded-md object-cover",
                    isModelImageLoading && "opacity-0"
                  )}
                  onLoad={() => setIsModelImageLoading(false)}
                  onError={() => setIsModelImageLoading(false)}
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  {isModelLoading ? "Loading..." : model?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isModelLoading ? "Fetching category" : `${model?.category} Model`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => window.location.href = "/models"}
              >
                Change
              </Button>
            </div>

            {/* Generator form */}
            <div className="bg-card rounded-lg shadow-card p-6 space-y-4">
              <Tabs defaultValue="prompt">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="prompt">Text Prompt</TabsTrigger>
                  <TabsTrigger value="upload">Reference Image</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prompt" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      placeholder="Describe what you want to generate... (e.g., Model wearing summer dress on beach)"
                      className="min-h-[120px] resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Reference Image</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop an image, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Select File
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Text Prompt</label>
                    <Textarea
                      placeholder="Provide additional details... (optional)"
                      className="min-h-[80px] resize-none"
                      value={additionalPrompt}
                      onChange={(e) => setAdditionalPrompt(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select value={format} onValueChange={(value: "image" | "video") => setFormat(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {model?.supportsImage && (
                        <SelectItem value="image">
                          <div className="flex items-center">
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Image
                          </div>
                        </SelectItem>
                      )}
                      {model?.supportsVideo && (
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <FileVideo2 className="h-4 w-4 mr-2" />
                            Video
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Select value={quantity} onValueChange={setQuantity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Generation</SelectItem>
                      <SelectItem value="2">2 Generations</SelectItem>
                      <SelectItem value="4">4 Generations</SelectItem>
                      {/* <SelectItem value="16">16 Generations</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Creativity Level</label>
                  <span className="text-xs text-muted-foreground">{creativityLevel}%</span>
                </div>
                <Slider
                  value={[creativityLevel]}
                  max={100}
                  step={1}
                  className="py-4"
                  onValueChange={(values) => setCreativityLevel(values[0] ?? creativityLevel)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Experimental</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-cta hover:bg-cta-600 text-white"
                disabled={isGenerating || !prompt.trim()}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Generation
                  </>
                )}
              </Button>

              {error ? (
                <p className="text-sm text-destructive text-center">{error}</p>
              ) : null}
              
              <p className="text-xs text-center text-muted-foreground">
                This will use <strong>4</strong> of your remaining credits
              </p>
            </div>
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              <div className="bg-card rounded-lg shadow-card p-8 text-center h-full flex flex-col items-center justify-center">
                <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generating Your Content</h3>
                <p className="text-muted-foreground mb-6">This might take a minute or two...</p>
                <div className="w-full max-w-md h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="bg-primary h-full animate-progress"></div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Creating {quantity} images with {model.name}
                </p>
              </div>
            ) : showResults ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Results</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-cta hover:bg-cta-600"
                      onClick={handleDownloadAll}
                      disabled={!hasGenerationAssets || isResultsLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </div>

                {resultsError ? (
                  <p className="text-sm text-destructive">{resultsError}</p>
                ) : null}

                {isResultsLoading && !generationItems.length ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-64 w-full" />
                    ))}
                  </div>
                ) : null}

                {!isResultsLoading && !generationItems.length ? (
                  <div className="p-4 bg-secondary rounded-lg text-sm text-muted-foreground text-center">
                    No generated assets are available yet. Please wait a moment or try regenerating.
                  </div>
                ) : null}

                {generationItems.length ? (
                  <div className="space-y-4">
                    <div className="grid">
                      {generationItems.map((item, index) => {
                        const promptPreview = truncateText(item.prompt);
                        const assets = normalizeAssets(item);

                        if (!assets.length) return null;

                        return (
                          <div
                            key={item.id ?? index}
                            className="bg-card rounded-lg overflow-hidden shadow-card flex flex-col h-full"
                          >
                            <div className="flex flex-col gap-3 p-4 border-b bg-secondary/30 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-12 w-12 rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                                  {item.model_img_url ? (
                                    <img
                                      src={item.model_img_url}
                                      alt={item.model_name ?? "Model image"}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Skeleton className="h-full w-full" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold leading-tight truncate">{item.model_name ?? "Unknown model"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{formatDateTime(item.created_at)}</p>
                                </div>
                              </div>
                              <div className="w-full sm:w-[55%]">
                                <p
                                  className="text-sm text-muted-foreground leading-relaxed overflow-hidden"
                                  title={item.prompt ?? "No prompt provided"}
                                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                                >
                                  {promptPreview}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                              {assets.map((asset, assetIndex) => {
                                const assetStatus = (asset.status ?? item.status ?? "").toLowerCase();
                                const isPending = assetStatus === "queued" || assetStatus === "processing";
                                const displayUrl = asset.output_image_url ?? asset.preview_url ?? asset.url ?? asset.asset_url;
                                const assetUrl = asset.output_image_url ?? asset.output_video_url ?? displayUrl;

                                if (!displayUrl && !isPending) return null;
                                if (assetUrl && removedAssets.has(assetUrl)) return null;

                                const favoriteKey = asset.output_image_url ?? displayUrl ?? `${item.id}-${assetIndex}`;
                                const isFavorite = favoriteAssets.has(favoriteKey);

                                return (
                                  <div
                                    key={asset.id ?? assetIndex}
                                    className="relative rounded-lg overflow-hidden border bg-secondary/40 group"
                                  >
                                    {isPending ? (
                                      <div className="flex h-64 flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="text-sm capitalize">{assetStatus || "pending"}</span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        className="relative block h-full w-full text-left"
                                        onClick={() => {
                                          if (!asset.output_image_url || (assetUrl && removedAssets.has(assetUrl))) return;
                                          setSelectedAsset({
                                            url: asset.output_image_url,
                                            label: `Generation ${item.id ?? index + 1}`,
                                          });
                                        }}
                                        disabled={!asset.output_image_url}
                                      >
                                        {displayUrl ? (
                                          <img
                                            src={displayUrl}
                                            alt={`Generated result ${index + 1}-${assetIndex + 1}`}
                                            className={cn(
                                              "w-full h-64 object-cover transition-opacity",
                                              !asset.output_image_url && "opacity-70"
                                            )}
                                          />
                                        ) : null}

                                        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-opacity group-hover:opacity-100">
                                          <div className="flex h-full w-full items-start justify-end p-2">

                                            <Button
                                              variant="secondary"
                                              size="sm"
                                              className={cn(
                                                "pointer-events-auto",
                                                isFavorite && "bg-cta text-white hover:bg-cta"
                                              )}
                                              disabled={!asset.output_image_url}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!asset.output_image_url) return;
                                                handleToggleFavorite(favoriteKey);
                                              }}
                                            >
                                              <Heart className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {resultsCursor ? (
                      <div className="flex justify-center">
                        <Button onClick={handleLoadMoreResults} variant="outline" disabled={isResultsLoading}>
                          {isResultsLoading ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Selected image modal */}
                {selectedAsset && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAsset(null)}>
                    <div className="relative bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">{selectedAsset.label ?? "Generated Image"}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(null)}>
                          ×
                        </Button>
                      </div>
                      <div className="p-4">
                        <img
                          src={selectedAsset.url}
                          alt="Selected result"
                          className="w-full h-auto max-h-[70vh] object-contain"
                        />
                      </div>
                      <div className="p-4 border-t flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Like
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Dislike
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveAsset(selectedAsset.url)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            className="bg-cta hover:bg-cta-600"
                            onClick={() => handleDownloadAsset(selectedAsset.url, "generation")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow-card p-8 text-center h-full flex flex-col items-center justify-center">
                <Image className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Content Generated Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Enter a prompt, select your options, and click "Generate" to create AI-powered content with {model.name}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Generation usually takes 30-60 seconds</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Generator;
