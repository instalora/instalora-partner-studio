
import { LayoutDashboard, Image, Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { ProgressCard } from "@/components/ui/progress-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo } from "@/hooks/useUserInfo";

const Dashboard = () => {
  const { userInfo, isLoadingUser } = useUserInfo();
  const displayName = userInfo ? `${userInfo.first_name} ` : "Partner";

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              {isLoadingUser ? (
                <Skeleton className="h-10 w-64" />
              ) : (
                `Welcome back, ${displayName}`
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLoadingUser ? (
                <Skeleton className="h-4 w-72" />
              ) : (
                "Here's what's happening with your AI-generated content"
              )}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-cta hover:bg-cta-600 shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate New Content
          </Button>
        </div>

        {/* Stats overview */}
        <section>
          <SectionHeader
            title="Overview"
            description="Your content generation stats at a glance"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Generations"
              value="1,523"
              icon={<Image className="h-5 w-5" />}
              trend={{ value: 12.5, isPositive: true }}
            />
            <ProgressCard
              title="Monthly Quota"
              current={237}
              max={500}
              icon={<Clock className="h-5 w-5" />}
            />
            <StatsCard
              title="Avg. Engagement"
              value="4.8"
              description="Likes per asset"
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatsCard
              title="Models Used"
              value="7"
              description="Out of 12 available"
              icon={<Users className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <SectionHeader
            title="Recent Activity"
            description="Your latest content generations"
          />
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors border-b last:border-b-0"
              >
                <div className="w-16 h-16 bg-secondary rounded-md shrink-0 overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/200x200?portrait&sig=${item}`} 
                    alt="Generated content" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    Model in summer dress on beach
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated 3 hours ago • Model: Sophia
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Share</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">View All Activity</Button>
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <SectionHeader
            title="Quick Actions"
            description="Common tasks you might want to perform"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center p-6 gap-2"
              onClick={() => window.location.href = "/models"}
            >
              <Users className="h-8 w-8 text-primary" />
              <span className="font-medium">Browse Models</span>
              <span className="text-xs text-muted-foreground">
                Explore our collection of AI models
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center p-6 gap-2 border-primary/20"
              onClick={() => window.location.href = "/generator"}
            >
              <Sparkles className="h-8 w-8 text-cta" />
              <span className="font-medium">New Generation</span>
              <span className="text-xs text-muted-foreground">
                Create new AI-generated content
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center p-6 gap-2"
              onClick={() => window.location.href = "/library"}
            >
              <Image className="h-8 w-8 text-primary" />
              <span className="font-medium">Content Library</span>
              <span className="text-xs text-muted-foreground">
                View your saved generations
              </span>
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
