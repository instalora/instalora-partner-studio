
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  RefreshCw
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api-client";

type ApiModel = {
  name?: string;
  list_image_url?: string;
  category_name?: string;
  supports_image?: boolean;
  supports_video?: boolean;
};

type ModelInfo = {
  name: string;
  image: string;
  category: string;
  supportsImage: boolean;
  supportsVideo: boolean;
};

const normalizeModel = (data: ApiModel | null | undefined): ModelInfo => ({
  name: data?.name ?? "Unknown Model",
  image: data?.list_image_url ?? "https://source.unsplash.com/random/400x600?portrait&woman&sig=1",
  category: data?.category_name ?? "Uncategorized",
  supportsImage: data?.supports_image ?? true,
  supportsVideo: data?.supports_video ?? false,
});

const mockResults = [
  "https://source.unsplash.com/random/600x800?fashion&woman&sig=1",
  "https://source.unsplash.com/random/600x800?fashion&woman&sig=2",
  "https://source.unsplash.com/random/600x800?fashion&woman&sig=3",
  "https://source.unsplash.com/random/600x800?fashion&woman&sig=4",
];

const Generator = () => {
  const [searchParams] = useSearchParams();
  const modelSlug = searchParams.get("model")?.trim();

  const [model, setModel] = useState<ModelInfo>(normalizeModel(null));
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const apiBaseUrl = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL as string | undefined
      ?? "https://api-3mtz.onrender.com").replace(/\/$/, ""),
    []
  );

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

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 3000);
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
              <img
                src={model?.image}
                alt={model?.name}
                className="w-16 h-16 rounded-md object-cover"
              />
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
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
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
                      <SelectItem value="4">4 Generations</SelectItem>
                      <SelectItem value="8">8 Generations</SelectItem>
                      <SelectItem value="16">16 Generations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Creativity Level</label>
                  <span className="text-xs text-muted-foreground">Balanced</span>
                </div>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="py-4"
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
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button size="sm" className="bg-cta hover:bg-cta-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {mockResults.map((image, index) => (
                    <div
                      key={index}
                      className="relative bg-card rounded-lg overflow-hidden shadow-card cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`Generated result ${index + 1}`} 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <Button variant="secondary" size="sm" className="mr-2">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Selected image modal */}
                {selectedImage && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold">Generated Image</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                          ×
                        </Button>
                      </div>
                      <div className="p-4">
                        <img 
                          src={selectedImage} 
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
                          <Button size="sm" className="bg-cta hover:bg-cta-600">
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
