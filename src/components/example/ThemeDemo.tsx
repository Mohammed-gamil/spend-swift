import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User, TrendingUp } from "lucide-react";

export function ThemeDemo() {
  return (
    <div className="p-8 space-y-6 bg-background min-h-screen">
      {/* Header section demonstrating text hierarchy */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">4-Color Theme Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating the consistent color scheme: #1b1b1b background, #f2aa38 accents, #fefefe main text, #bcbcbd sub text
        </p>
      </div>

      {/* Cards showcasing the theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Dashboard Stats</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardDescription className="text-muted-foreground">
              Your performance overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Active Requests</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                24
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending Approvals</span>
              <span className="text-primary font-semibold">8</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">User Profile</CardTitle>
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardDescription className="text-muted-foreground">
              Account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="default" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-primary transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-foreground">Interactive Elements</CardTitle>
            <CardDescription className="text-muted-foreground">
              Buttons and controls showcase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm">Default</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Active</Badge>
              <Badge variant="secondary">Pending</Badge>
              <Badge variant="outline">Draft</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color palette reference */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Color Palette Reference</CardTitle>
          <CardDescription className="text-muted-foreground">
            The four colors used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-xl bg-background border-2 border-primary mx-auto"></div>
              <div className="text-foreground font-medium">#1b1b1b</div>
              <div className="text-muted-foreground text-sm">Main Background</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-xl bg-primary mx-auto"></div>
              <div className="text-foreground font-medium">#f2aa38</div>
              <div className="text-muted-foreground text-sm">Strokes & Icons</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-xl bg-foreground border-2 border-primary mx-auto"></div>
              <div className="text-foreground font-medium">#fefefe</div>
              <div className="text-muted-foreground text-sm">Main Text</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-xl bg-muted-foreground border-2 border-primary mx-auto"></div>
              <div className="text-foreground font-medium">#bcbcbd</div>
              <div className="text-muted-foreground text-sm">Sub Text</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}