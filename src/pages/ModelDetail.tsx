
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Share2, 
  Star, 
  Image, 
  FileVideo2, 
  Info, 
  Sparkles,
  Tag,
  Users,
  BarChart3,
  Camera
} from "lucide-react";

// Mock model data
const mockModels = {
  "1": {
    id: "1",
    name: "Sophia",
    images: [
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=1",
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=2",
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=3",
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=4",
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=5",
      "https://source.unsplash.com/random/600x800?portrait&woman&sig=6",
    ],
    category: "Fashion",
    genres: ["High Fashion", "Casual", "Swimwear"],
    rating: 4.8,
    likes: 1245,
    description: "Sophia is a professional model with experience in high fashion and editorial work. Her versatile look makes her perfect for a wide range of fashion styles, from casual to haute couture.",
    stats: {
      generations: 2458,
      shares: 845,
      clicks: 3254,
      conversionRate: "2.8%"
    }
  },
  "2": {
    id: "2",
    name: "Marcus",
    images: [
      "https://source.unsplash.com/random/600x800?portrait&man&sig=1",
      "https://source.unsplash.com/random/600x800?portrait&man&sig=2",
      "https://source.unsplash.com/random/600x800?portrait&man&sig=3",
      "https://source.unsplash.com/random/600x800?portrait&man&sig=4",
      "https://source.unsplash.com/random/600x800?portrait&man&sig=5",
      "https://source.unsplash.com/random/600x800?portrait&man&sig=6",
    ],
    category: "Fitness",
    genres: ["Athletic", "Outdoor", "Lifestyle"],
    rating: 4.6,
    likes: 982,
    description: "Marcus specializes in fitness and athletic modeling. His athletic build makes him ideal for sportswear, fitness equipment, and active lifestyle brands.",
    stats: {
      generations: 1842,
      shares: 624,
      clicks: 2154,
      conversionRate: "2.3%"
    }
  }
};

const ModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use ID to get model data, default to first model if not found
  const modelId = id && mockModels[id] ? id : "1";
  const model = mockModels[modelId];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionHeader
            title={`${model.name} - AI Model`}
            description={`Explore and generate content with ${model.name}`}
            className="mb-0"
          />
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              className="bg-cta hover:bg-cta-600"
              onClick={() => navigate(`/generator?model=${model.id}`)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left column - Model info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card rounded-lg shadow-card overflow-hidden">
              <div className="relative">
                <img 
                  src={model.images[0]} 
                  alt={model.name} 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium py-1 px-2 rounded-full bg-primary/90">
                      {model.category}
                    </span>
                    <div className="flex items-center text-white">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm">{model.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{model.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {model.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Available for image and video generation</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="text-sm">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {model.genres.map((genre) => (
                          <span 
                            key={genre} 
                            className="text-xs bg-accent px-2 py-0.5 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{model.likes} people like this model</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-card p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Model Performance
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-accent/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Total Generations</p>
                    <p className="text-lg font-semibold">{model.stats.generations.toLocaleString()}</p>
                  </div>
                  <div className="bg-accent/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Shares</p>
                    <p className="text-lg font-semibold">{model.stats.shares.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-accent/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="text-lg font-semibold">{model.stats.clicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-accent/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                    <p className="text-lg font-semibold">{model.stats.conversionRate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-card p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Best Practices
              </h3>
              
              <div className="text-sm space-y-2">
                <p>• Use detailed prompts specifying outfit, setting and pose</p>
                <p>• For best results, include reference images when available</p>
                <p>• This model excels at {model.category.toLowerCase()} content</p>
                <p>• Experiment with different styles to find optimal engagement</p>
              </div>
            </div>
          </div>

          {/* Right column - Content examples */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="portfolio" className="space-y-4">
              <TabsList>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <FileVideo2 className="h-4 w-4" />
                  Videos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="space-y-6">
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Generated Content</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {model.images.map((image, index) => (
                      <div 
                        key={index}
                        className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={image} 
                          alt={`${model.name} example ${index + 1}`} 
                          className="w-full h-56 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      View More Examples
                    </Button>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Prompt Ideas</h3>
                  
                  <div className="space-y-3">
                    <div 
                      className="p-3 bg-accent/50 rounded-lg hover:bg-accent/80 cursor-pointer transition-colors"
                      onClick={() => navigate(`/generator?model=${model.id}&prompt=${encodeURIComponent("Summer beach outfit with sunglasses and straw hat")}`)}
                    >
                      <p className="font-medium">Summer beach outfit with sunglasses and straw hat</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Perfect for summer fashion collections and beachwear promotions
                      </p>
                    </div>
                    
                    <div 
                      className="p-3 bg-accent/50 rounded-lg hover:bg-accent/80 cursor-pointer transition-colors"
                      onClick={() => navigate(`/generator?model=${model.id}&prompt=${encodeURIComponent("Urban street style with leather jacket and boots")}`)}
                    >
                      <p className="font-medium">Urban street style with leather jacket and boots</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Great for edgy fashion brands and fall/winter collections
                      </p>
                    </div>
                    
                    <div 
                      className="p-3 bg-accent/50 rounded-lg hover:bg-accent/80 cursor-pointer transition-colors"
                      onClick={() => navigate(`/generator?model=${model.id}&prompt=${encodeURIComponent("Elegant evening wear with jewelry and clutch purse")}`)}
                    >
                      <p className="font-medium">Elegant evening wear with jewelry and clutch purse</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ideal for luxury brands and special occasion promotions
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Video Content</h3>
                  
                  <div className="grid gap-6">
                    <div className="rounded-lg overflow-hidden bg-accent/50 p-8 text-center">
                      <FileVideo2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Video Examples Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        We're working on adding video examples for {model.name}.
                      </p>
                      <Button 
                        className="bg-cta hover:bg-cta-600"
                        onClick={() => navigate(`/generator?model=${model.id}&type=video`)}
                      >
                        Create Video Content Now
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-medium mb-2">Video Prompt Ideas</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="p-2 bg-accent/30 rounded-md">Walking down city street showcasing outfit</li>
                        <li className="p-2 bg-accent/30 rounded-md">Product unboxing and first impressions</li>
                        <li className="p-2 bg-accent/30 rounded-md">Fitness routine demonstrating activewear</li>
                        <li className="p-2 bg-accent/30 rounded-md">Transition between multiple outfits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModelDetail;
