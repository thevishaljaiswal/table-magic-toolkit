
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Log when component mounts to help with debugging
    console.log("Index component mounted");
    setMounted(true);
    
    // Show a toast to confirm the app is working
    toast({
      title: "Welcome to the app!",
      description: "The app is running correctly.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Analytics Dashboard</CardTitle>
          <CardDescription>
            {mounted ? "Interactive data visualization and reporting tool" : "App is loading..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-center">
            Access comprehensive business analytics and reporting tools
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/report')}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              View Full Report
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {new Date().toLocaleDateString()}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
