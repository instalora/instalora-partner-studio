
import { useState } from "react";
import { Heart, Eye, Star, Share2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  likes: number;
  audienceCount?: number;
  isFavorite?: boolean;
  className?: string;
}

const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatNumber = (value: number) => numberFormatter.format(value);

export function ModelCard({
  id,
  name,
  image,
  category,
  rating,
  likes,
  audienceCount,
  isFavorite,
  className,
}: ModelCardProps) {
  const [liked, setLiked] = useState(Boolean(isFavorite));

  return (
    <div
      className={cn(
        "bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in",
        className
      )}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-64 object-cover object-center"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        >
          <Heart className={cn("h-5 w-5", liked ? "fill-red-500 text-red-500" : "")} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-xs font-medium py-1 px-2 rounded-full bg-primary/90 text-white">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <span className="flex items-center mr-4">
            <Heart className="w-4 h-4 mr-1" /> {formatNumber(likes)}
          </span>
          {typeof audienceCount === "number" && (
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" /> {formatNumber(audienceCount)}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button 
            className="flex-1 bg-cta hover:bg-cta-600"
            onClick={() => window.location.href = `/generator?model=${id}`}
          >
            Generate
          </Button>
          <Button 
            variant="outline"
            className="w-10 p-0 flex items-center justify-center"
            onClick={() => window.location.href = `/models/${id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            className="w-10 p-0 flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
