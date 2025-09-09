import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowRight } from "lucide-react";

export function ThemedCardExample() {
  return (
    <Card className="bg-card/80 border-primary/30 shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-foreground">Sample Card</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sub text uses the muted gray and respects spacing and rounded corners.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4 text-primary" />
          <span>Primary icons are gold. Grid text uses muted gray.</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="border border-primary text-primary bg-transparent">Info</Badge>
          <Badge className="bg-primary text-primary-foreground">Primary</Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Dismiss
        </Button>
        <Button>
          Continue
          <ArrowRight className="ms-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
