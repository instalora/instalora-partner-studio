
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Calendar, Download, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, ArrowUp, ArrowDown, TrendingUp, ChevronDown } from "lucide-react";

// Mock data for charts
const monthlyData = [
  { name: "Jan", Images: 45, Videos: 12 },
  { name: "Feb", Images: 52, Videos: 15 },
  { name: "Mar", Images: 49, Videos: 18 },
  { name: "Apr", Images: 63, Videos: 21 },
  { name: "May", Images: 75, Videos: 25 },
  { name: "Jun", Images: 95, Videos: 32 },
];

const modelPerformance = [
  { name: "Sophia", Likes: 320, Shares: 215, Comments: 125 },
  { name: "Marcus", Likes: 280, Shares: 190, Comments: 110 },
  { name: "Aisha", Likes: 350, Shares: 240, Comments: 145 },
  { name: "Elena", Likes: 310, Shares: 220, Comments: 120 },
  { name: "Jackson", Likes: 270, Shares: 180, Comments: 95 },
];

const categoryDistribution = [
  { name: "Fashion", value: 45 },
  { name: "Lifestyle", value: 25 },
  { name: "Fitness", value: 15 },
  { name: "Beauty", value: 10 },
  { name: "Travel", value: 5 },
];

const colors = ["#8B5CF6", "#6D28D9", "#9D7FF5", "#5B21B6", "#7C3AED"];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionHeader
            title="Analytics Dashboard"
            description="Track performance metrics for your AI-generated content"
            className="mb-0"
          />
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 30 Days
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Generations</p>
                <h3 className="text-2xl font-bold mt-1">1,523</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" /> 12.5%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Engagement Rate</p>
                <h3 className="text-2xl font-bold mt-1">4.8%</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" /> 2.3%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                <h3 className="text-2xl font-bold mt-1">12,854</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" /> 8.7%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <LineChartIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Content ROI</p>
                <h3 className="text-2xl font-bold mt-1">349%</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3 mr-1" /> 3.2%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <PieChartIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="conversions">Conversions</TabsTrigger>
              </TabsList>
              
              <Select defaultValue="30d">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Content Generation Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Images" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Videos" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Content Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Likes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Shares" fill="#F97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Comments" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Images" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Videos" stroke="#F97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Engagement Types</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Images" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                      <Area type="monotone" dataKey="Videos" stackId="1" stroke="#F97316" fill="#F97316" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Engagement Breakdown</h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 pr-8 font-medium">Content Type</th>
                        <th className="pb-3 pr-8 font-medium">Impressions</th>
                        <th className="pb-3 pr-8 font-medium">Clicks</th>
                        <th className="pb-3 pr-8 font-medium">Likes</th>
                        <th className="pb-3 pr-8 font-medium">Shares</th>
                        <th className="pb-3 pr-8 font-medium">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Instagram Stories</td>
                        <td className="py-3 pr-8">24,521</td>
                        <td className="py-3 pr-8">3,854</td>
                        <td className="py-3 pr-8">2,145</td>
                        <td className="py-3 pr-8">842</td>
                        <td className="py-3 pr-8">15.7%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Instagram Feed</td>
                        <td className="py-3 pr-8">32,651</td>
                        <td className="py-3 pr-8">4,321</td>
                        <td className="py-3 pr-8">3,542</td>
                        <td className="py-3 pr-8">1,245</td>
                        <td className="py-3 pr-8">13.2%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Facebook Ads</td>
                        <td className="py-3 pr-8">18,542</td>
                        <td className="py-3 pr-8">2,854</td>
                        <td className="py-3 pr-8">1,854</td>
                        <td className="py-3 pr-8">621</td>
                        <td className="py-3 pr-8">15.4%</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-8">TikTok</td>
                        <td className="py-3 pr-8">45,874</td>
                        <td className="py-3 pr-8">5,874</td>
                        <td className="py-3 pr-8">4,521</td>
                        <td className="py-3 pr-8">2,145</td>
                        <td className="py-3 pr-8">12.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="models">
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold mb-4">Model Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={modelPerformance}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Likes" fill="#8B5CF6" />
                    <Bar dataKey="Shares" fill="#F97316" />
                    <Bar dataKey="Comments" fill="#6D28D9" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 pr-8 font-medium">Model</th>
                        <th className="pb-3 pr-8 font-medium">Usage</th>
                        <th className="pb-3 pr-8 font-medium">Avg. Engagement</th>
                        <th className="pb-3 pr-8 font-medium">Conversion Rate</th>
                        <th className="pb-3 pr-8 font-medium">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Sophia</td>
                        <td className="py-3 pr-8">245 generations</td>
                        <td className="py-3 pr-8">4.8%</td>
                        <td className="py-3 pr-8">2.3%</td>
                        <td className="py-3 pr-8">428%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Marcus</td>
                        <td className="py-3 pr-8">187 generations</td>
                        <td className="py-3 pr-8">4.2%</td>
                        <td className="py-3 pr-8">1.9%</td>
                        <td className="py-3 pr-8">352%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Aisha</td>
                        <td className="py-3 pr-8">267 generations</td>
                        <td className="py-3 pr-8">5.1%</td>
                        <td className="py-3 pr-8">2.7%</td>
                        <td className="py-3 pr-8">485%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Elena</td>
                        <td className="py-3 pr-8">201 generations</td>
                        <td className="py-3 pr-8">4.5%</td>
                        <td className="py-3 pr-8">2.1%</td>
                        <td className="py-3 pr-8">392%</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-8">Jackson</td>
                        <td className="py-3 pr-8">165 generations</td>
                        <td className="py-3 pr-8">3.9%</td>
                        <td className="py-3 pr-8">1.8%</td>
                        <td className="py-3 pr-8">342%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="conversions">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Images" name="Image Conversion" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Videos" name="Video Conversion" stroke="#F97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-card rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">E-commerce Performance</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                      <h3 className="text-2xl font-bold mt-1">$24,532</h3>
                      <span className="text-xs font-medium flex items-center text-green-500 mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" /> 18.5%
                      </span>
                    </div>
                    
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <h3 className="text-2xl font-bold mt-1">2.4%</h3>
                      <span className="text-xs font-medium flex items-center text-green-500 mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" /> 0.3%
                      </span>
                    </div>
                    
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                      <h3 className="text-2xl font-bold mt-1">$78.45</h3>
                      <span className="text-xs font-medium flex items-center text-green-500 mt-1">
                        <ArrowUp className="h-3 w-3 mr-1" /> 5.2%
                      </span>
                    </div>
                    
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Cost per Acquisition</p>
                      <h3 className="text-2xl font-bold mt-1">$12.20</h3>
                      <span className="text-xs font-medium flex items-center text-red-500 mt-1">
                        <ArrowDown className="h-3 w-3 mr-1" /> 2.1%
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-sm mb-2">Top Converting Products</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-accent/30 rounded-md">
                      <span>Summer Collection Dress</span>
                      <span className="font-medium">4.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-accent/30 rounded-md">
                      <span>Premium Activewear Set</span>
                      <span className="font-medium">3.8%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-accent/30 rounded-md">
                      <span>Limited Edition Sneakers</span>
                      <span className="font-medium">3.5%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Attribution Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 pr-8 font-medium">Channel</th>
                        <th className="pb-3 pr-8 font-medium">Sessions</th>
                        <th className="pb-3 pr-8 font-medium">Conversions</th>
                        <th className="pb-3 pr-8 font-medium">Conv. Rate</th>
                        <th className="pb-3 pr-8 font-medium">Revenue</th>
                        <th className="pb-3 pr-8 font-medium">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Instagram</td>
                        <td className="py-3 pr-8">12,542</td>
                        <td className="py-3 pr-8">354</td>
                        <td className="py-3 pr-8">2.8%</td>
                        <td className="py-3 pr-8">$8,245</td>
                        <td className="py-3 pr-8">4.2x</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">Facebook</td>
                        <td className="py-3 pr-8">8,745</td>
                        <td className="py-3 pr-8">187</td>
                        <td className="py-3 pr-8">2.1%</td>
                        <td className="py-3 pr-8">$5,324</td>
                        <td className="py-3 pr-8">3.5x</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pr-8">TikTok</td>
                        <td className="py-3 pr-8">15,842</td>
                        <td className="py-3 pr-8">412</td>
                        <td className="py-3 pr-8">2.6%</td>
                        <td className="py-3 pr-8">$9,854</td>
                        <td className="py-3 pr-8">4.8x</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-8">Direct</td>
                        <td className="py-3 pr-8">4,521</td>
                        <td className="py-3 pr-8">98</td>
                        <td className="py-3 pr-8">2.2%</td>
                        <td className="py-3 pr-8">$2,354</td>
                        <td className="py-3 pr-8">N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
