
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// This is a mockup of the payment details screen shown in the reference image
const RecordDetail = () => {
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("id");
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2" 
            onClick={() => navigate('/report')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Report
          </Button>
        </div>
        <div>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Record ID: {recordId}</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">Contact Sales</Button>
      </div>
      
      {/* Progress steps inspired by the reference image */}
      <div className="w-full flex items-center mb-10 mt-8">
        <div className={cn("h-2 bg-purple-200 flex-1 rounded-l-full", "bg-purple-500")}>
          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm font-medium">Events</div>
          </div>
        </div>
        <div className={cn("h-2 bg-purple-200 flex-1", "bg-purple-500")}>
          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm font-medium">Add-Ons</div>
          </div>
        </div>
        <div className={cn("h-2 bg-purple-200 flex-1", "bg-purple-500")}>
          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm font-medium">Payment</div>
          </div>
        </div>
        <div className={cn("h-2 bg-purple-200 flex-1 rounded-r-full")}>
          <div className="relative">
            <div className="absolute -top-8 left-0 text-sm font-medium">Review</div>
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Enter your payment details</h2>
      <p className="text-gray-600 mb-6">
        We make payment easy and fast. No need to negotiate with sales teams.<br />
        Enter your payment details and start building right away.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Card number</label>
            <input 
              type="text" 
              placeholder="1234 1234 1234 1234" 
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">CVV</label>
            <input 
              type="text" 
              placeholder="3 or 4 digits" 
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Expiration</label>
            <input 
              type="text" 
              placeholder="MM / YY" 
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Country</label>
            <select className="w-full px-4 py-2 border rounded-md">
              <option>Select Country</option>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>
      </div>
      
      <Button className="bg-purple-500 hover:bg-purple-600">Review</Button>
      
      <Card className="mt-8 border-0 shadow-none">
        <CardHeader className="px-0 pt-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Your Current Plan</CardTitle>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Events: Free</div>
              <div className="text-sm text-muted-foreground">Monthly | May 01, 2023 - May 31, 2023</div>
            </div>
            <div className="text-xl font-bold">$0.00</div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          <div className="mt-4">
            <div className="font-medium">JD Mobbin</div>
            <div className="mt-2 flex space-x-4 items-center">
              <label className="flex items-center">
                <input type="radio" name="billing-cycle" checked className="mr-2 text-purple-600" />
                <span>Monthly</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="billing-cycle" className="mr-2" />
                <span>Annual</span>
              </label>
            </div>
            <div className="mt-2 bg-green-50 text-green-800 p-2 rounded text-sm">
              Save $390/mo on annual billing
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Your Plan</div>
                <div className="text-sm text-muted-foreground">Growth 15M events</div>
              </div>
              <div className="text-xl font-bold">$1,365.00</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Add-Ons</div>
                <div className="text-sm text-muted-foreground">Data Pipelines</div>
              </div>
              <div className="text-xl font-bold">$273.00</div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mt-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div className="font-medium">Breakdown</div>
              <div className="font-bold">▼</div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium">New Plan Term: May 11, 2023—May 31, 2023</div>
              <div className="mt-2 flex justify-between text-sm">
                <div>Prorated New Plan</div>
                <div>$880.64</div>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <div>Prorated Data Pipelines</div>
                <div>$176.13</div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center font-medium">
              <div>Total Due Today</div>
              <div className="text-xl font-bold">$1,056.77</div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Renews: Jun 01, 2023</div>
              <div className="text-xl font-bold">$1,638.00</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-10 py-8 border-t flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg">Mixpanel</div>
        </div>
        <div>curated by Mobbin</div>
      </div>
    </div>
  );
};

export default RecordDetail;
