
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ProgressCardProps {
  title: string;
  current: number;
  max: number;
  icon?: ReactNode;
  className?: string;
}

export function ProgressCard({
  title,
  current,
  max,
  icon,
  className,
}: ProgressCardProps) {
  const percentage = Math.min(Math.round((current / max) * 100), 100);
  
  return (
    <div className={cn(
      "bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold">{current}/{max}</h3>
            {icon && (
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                {icon}
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{percentage}% used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
