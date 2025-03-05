
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Check, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type StepperStep = "events" | "addons" | "payment" | "review";

const RecordDetail = () => {
  const [searchParams] = useSearchParams();
  const recordId = searchParams.get("id");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [currentStep, setCurrentStep] = useState<StepperStep>("events");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("Conference");
  const [attendees, setAttendees] = useState("");
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [country, setCountry] = useState("");
  const [billingType, setBillingType] = useState<"monthly" | "annual">("monthly");
  
  // Step management
  const steps: StepperStep[] = ["events", "addons", "payment", "review"];
  const stepTitles: Record<StepperStep, string> = {
    events: "Events",
    addons: "Add-Ons",
    payment: "Payment",
    review: "Review"
  };
  
  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      setCurrentStep(previousStep);
    }
  };
  
  const goToStep = (step: StepperStep) => {
    setCurrentStep(step);
  };
  
  // Toggle addon selection
  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter(item => item !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };
  
  // Submit form
  const handleSubmit = () => {
    toast({
      title: "Subscription updated",
      description: "Your subscription changes have been processed successfully.",
    });
    navigate('/report');
  };
  
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
      
      {/* Progress steps */}
      <div className="w-full flex items-center mb-10 mt-8">
        {steps.map((step, index) => {
          const isActive = steps.indexOf(currentStep) >= index;
          const isFirstStep = index === 0;
          const isLastStep = index === steps.length - 1;
          
          return (
            <div 
              key={step} 
              className={cn(
                "h-2 flex-1",
                isFirstStep && "rounded-l-full", 
                isLastStep && "rounded-r-full",
                isActive ? "bg-purple-500" : "bg-purple-200"
              )}
              onClick={() => goToStep(step)}
            >
              <div className="relative cursor-pointer">
                <div className={cn(
                  "absolute -top-8 left-0 text-sm font-medium",
                  currentStep === step ? "text-purple-600" : "text-gray-500"
                )}>
                  {stepTitles[step]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Step content */}
      <div className="mt-10">
        {currentStep === "events" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Event Details</h2>
            <p className="text-gray-600 mb-6">
              Tell us about your event so we can customize your experience.<br />
              Fill in the details below to get started.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Event Name</Label>
                  <Input 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Annual Tech Conference 2023" 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Event Type</Label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option>Conference</option>
                    <option>Webinar</option>
                    <option>Workshop</option>
                    <option>Meetup</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Event Date</Label>
                  <Input 
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Expected Attendees</Label>
                  <Input 
                    type="number"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="500" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-purple-500 hover:bg-purple-600 mt-4"
              onClick={goToNextStep}
              disabled={!eventName || !eventDate}
            >
              Next: Add-Ons
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        
        {currentStep === "addons" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Select Add-Ons</h2>
            <p className="text-gray-600 mb-6">
              Enhance your plan with these powerful add-ons.<br />
              Select the features that best suit your needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'data-pipelines', name: 'Data Pipelines', price: '$273', description: 'Connect and sync data from multiple sources' },
                { id: 'advanced-analytics', name: 'Advanced Analytics', price: '$199', description: 'Powerful analytics tools for deeper insights' },
                { id: 'custom-dashboards', name: 'Custom Dashboards', price: '$149', description: 'Create personalized dashboards for your team' },
                { id: 'audience-segmentation', name: 'Audience Segmentation', price: '$99', description: 'Segment your audience for targeted campaigns' },
                { id: 'ab-testing', name: 'A/B Testing', price: '$129', description: 'Test different versions of your product or content' },
                { id: 'data-export', name: 'Data Export API', price: '$79', description: 'Export your data to other platforms easily' }
              ].map(addon => (
                <Card 
                  key={addon.id} 
                  className={cn(
                    "cursor-pointer border transition-colors",
                    selectedAddons.includes(addon.id) 
                      ? "border-purple-500 bg-purple-50" 
                      : "hover:border-gray-300"
                  )}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                        {selectedAddons.includes(addon.id) && (
                          <Check className="h-3 w-3 text-purple-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{addon.description}</p>
                    <p className="font-semibold mt-2">{addon.price}/mo</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={goToPreviousStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back: Events
              </Button>
              
              <Button 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={goToNextStep}
              >
                Next: Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === "payment" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Enter your payment details</h2>
            <p className="text-gray-600 mb-6">
              We make payment easy and fast. No need to negotiate with sales teams.<br />
              Enter your payment details and start building right away.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Card number</Label>
                  <Input 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 1234 1234 1234" 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">CVV</Label>
                  <Input 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="3 or 4 digits" 
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Expiration</Label>
                  <Input 
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    placeholder="MM / YY" 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">Country</Label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={goToPreviousStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back: Add-Ons
              </Button>
              
              <Button 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={goToNextStep}
                disabled={!cardNumber || !expiration || !cvv || !country}
              >
                Next: Review
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === "review" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Review Your Order</h2>
            <p className="text-gray-600 mb-6">
              Please review your subscription details before confirming.<br />
              You can go back to make changes if needed.
            </p>
            
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Event Name</p>
                      <p>{eventName || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p>{eventDate || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Type</p>
                      <p>{eventType || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Attendees</p>
                      <p>{attendees || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Selected Add-Ons</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAddons.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedAddons.map(addon => {
                        const addonInfo = {
                          'data-pipelines': { name: 'Data Pipelines', price: '$273' },
                          'advanced-analytics': { name: 'Advanced Analytics', price: '$199' },
                          'custom-dashboards': { name: 'Custom Dashboards', price: '$149' },
                          'audience-segmentation': { name: 'Audience Segmentation', price: '$99' },
                          'ab-testing': { name: 'A/B Testing', price: '$129' },
                          'data-export': { name: 'Data Export API', price: '$79' }
                        }[addon];
                        
                        return (
                          <li key={addon} className="flex justify-between">
                            <span>{addonInfo?.name}</span>
                            <span>{addonInfo?.price}/mo</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No add-ons selected</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Card</p>
                      <p>{cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Billing Type</p>
                      <div className="mt-2 flex space-x-4 items-center">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="billing-cycle" 
                            checked={billingType === "monthly"} 
                            onChange={() => setBillingType("monthly")}
                            className="mr-2 text-purple-600" 
                          />
                          <span>Monthly</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="billing-cycle" 
                            checked={billingType === "annual"}
                            onChange={() => setBillingType("annual")}
                            className="mr-2" 
                          />
                          <span>Annual</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-green-50 text-green-800 p-2 rounded text-sm">
                    Save $390/mo on annual billing
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Order Summary</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="px-0">
                  <div className="mt-4">
                    <div className="font-medium">Your Plan</div>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">Growth 15M events</div>
                        <div className="text-sm text-muted-foreground">Monthly | May 01, 2023 - May 31, 2023</div>
                      </div>
                      <div className="text-xl font-bold">$1,365.00</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="font-medium">Add-Ons</div>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {selectedAddons.length > 0 
                            ? selectedAddons.map(addon => {
                                return {
                                  'data-pipelines': 'Data Pipelines',
                                  'advanced-analytics': 'Advanced Analytics',
                                  'custom-dashboards': 'Custom Dashboards',
                                  'audience-segmentation': 'Audience Segmentation',
                                  'ab-testing': 'A/B Testing',
                                  'data-export': 'Data Export API'
                                }[addon];
                              }).join(', ')
                            : 'No add-ons selected'
                          }
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {selectedAddons.length > 0 ? '$273.00' : '$0.00'}
                      </div>
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
                        <div>Prorated Add-Ons</div>
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
              
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline"
                  onClick={goToPreviousStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back: Payment
                </Button>
                
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={handleSubmit}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirm Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
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
