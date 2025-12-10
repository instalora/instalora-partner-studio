
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UserCog,
  BellRing,
  FileKey,
  Upload,
  Save, 
  Trash2, 
  Lock,
  CreditCard,
  Users,
  Mail
} from "lucide-react";

const Settings = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api-3mtz.onrender.com/v1.0/categories", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();
        const categoryList = Array.isArray(data)
          ? data
          : Array.isArray((data as { categories?: unknown }).categories)
            ? (data as { categories: { id: string; name: string }[] }).categories
            : [];

        if (categoryList.length > 0) {
          setCategories(categoryList);
          setSelectedCategory((current) => current || categoryList[0]?.id || "");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <SectionHeader
          title="Account Settings"
          description="Manage your account preferences and settings"
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-4 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold mb-4">Brand Information</h3>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="text-sm font-medium mb-2">Brand Logo</div>
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://via.placeholder.com/100" alt="Brand logo" />
                      <AvatarFallback>PB</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Change
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input id="brandName" defaultValue="Partner Brand" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Brand Description</Label>
                    <Textarea
                      id="description"
                      defaultValue="A premium fashion brand focused on sustainable clothing and accessories."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://partnerbrand.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input id="instagram" defaultValue="@partnerbrand" />
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" defaultValue="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" defaultValue="john@partnerbrand.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input id="contactPhone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Marketing Director" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="bg-cta hover:bg-cta-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold mb-4">Brand Preferences</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="modelPreferences">Model Preferences</Label>
                  <Textarea
                    id="modelPreferences"
                    placeholder="Describe your preferred model characteristics..."
                    className="min-h-[100px]"
                    defaultValue="We prefer models in the 25-35 age range, diverse ethnicities, with a focus on healthy, athletic builds that complement our activewear product line."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentGuidelines">Content Guidelines</Label>
                  <Textarea
                    id="contentGuidelines"
                    placeholder="Describe your brand's content guidelines..."
                    className="min-h-[100px]"
                    defaultValue="Our brand emphasizes natural settings with lots of natural light. We prefer outdoor locations like beaches, mountains, and urban parks. Avoid overly processed imagery."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brandColors">Brand Colors (Hex)</Label>
                  <Input
                    id="brandColors"
                    defaultValue="#2A5C8F, #E9C46A, #264653"
                    placeholder="#000000, #FFFFFF, etc."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button className="bg-cta hover:bg-cta-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                  </div>
                  <Switch
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">In-App Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications within the dashboard</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Email Alert Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="contentReady" className="mt-1" defaultChecked />
                    <div>
                      <Label htmlFor="contentReady">Content Generation Complete</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when your requested content has been generated
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="billing" className="mt-1" defaultChecked />
                    <div>
                      <Label htmlFor="billing">Billing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about upcoming charges and billing changes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="newModels" className="mt-1" defaultChecked />
                    <div>
                      <Label htmlFor="newModels">New Models Available</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when new AI models are added to the platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="marketing" className="mt-1" />
                    <div>
                      <Label htmlFor="marketing">Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive news, tips and promotional information
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-cta hover:bg-cta-600">
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="bg-card rounded-lg shadow-card p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Account Security</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Password</h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    <div>
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account by requiring both your password and a verification code.
                  </p>
                  <Button>Enable 2FA</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">API Keys</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage API keys to integrate with our services programmatically.
                  </p>
                  <Button className="flex items-center gap-2">
                    <FileKey className="h-4 w-4" />
                    Manage API Keys
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-destructive mb-3">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    These actions cannot be undone. Please be certain before proceeding.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Deactivate Account
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="bg-card rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Team member rows */}
                <div className="flex items-center p-3 rounded-md hover:bg-accent/50 transition-colors">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="https://via.placeholder.com/40" alt="John Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">John Smith</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>john@partnerbrand.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-md hover:bg-accent/50 transition-colors">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="https://via.placeholder.com/40" alt="Sarah Johnson" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Sarah Johnson</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>sarah@partnerbrand.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-accent px-2 py-1 rounded-full">Content Manager</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-md hover:bg-accent/50 transition-colors">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="https://via.placeholder.com/40" alt="Miguel Rodriguez" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Miguel Rodriguez</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>miguel@partnerbrand.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-accent px-2 py-1 rounded-full">Viewer</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Roles & Permissions</h3>
                <div className="space-y-4">
                  <div className="bg-accent/50 p-4 rounded-md">
                    <h4 className="font-medium">Admin</h4>
                    <p className="text-sm text-muted-foreground mb-2">Full control over all aspects of the account</p>
                    <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Manage team members and permissions</li>
                      <li>Access billing and subscription settings</li>
                      <li>Create, edit, and delete content</li>
                      <li>Access analytics and reporting</li>
                    </ul>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-md">
                    <h4 className="font-medium">Content Manager</h4>
                    <p className="text-sm text-muted-foreground mb-2">Can create and manage content</p>
                    <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Create new content generations</li>
                      <li>Edit and organize existing content</li>
                      <li>View basic analytics</li>
                      <li>Cannot access billing or team settings</li>
                    </ul>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-md">
                    <h4 className="font-medium">Viewer</h4>
                    <p className="text-sm text-muted-foreground mb-2">Read-only access to content</p>
                    <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                      <li>View and download generated content</li>
                      <li>View basic analytics</li>
                      <li>Cannot create or edit content</li>
                      <li>Cannot access settings or billing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
