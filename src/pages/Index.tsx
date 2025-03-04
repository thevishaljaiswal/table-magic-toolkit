
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Index = () => {
  const { toast } = useToast();
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
          <CardTitle className="text-3xl font-bold text-primary">Welcome to Your App</CardTitle>
          <CardDescription>
            {mounted ? "App is fully loaded" : "App is loading..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center mb-4">
            Start building your amazing project here!
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                console.log("Button clicked");
                toast({
                  title: "Button clicked",
                  description: "The UI is responding to interactions",
                });
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Click Me
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
