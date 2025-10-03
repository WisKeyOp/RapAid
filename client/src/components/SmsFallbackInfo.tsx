
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, WifiOff, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SmsFallbackInfo = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const shortcode = "56789"; // Example shortcode
  
  const handleCopyShortcode = () => {
    navigator.clipboard.writeText(shortcode).then(
      () => {
        toast({
          title: "Shortcode copied",
          description: `${shortcode} has been copied to your clipboard.`,
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };
  
  const handleSaveInstructions = () => {
    // Create text content for the instructions
    const instructions = 
`EMERGENCY SMS INSTRUCTIONS
When you have no internet access but need help:

Send SMS to: ${shortcode}
Format: HELP [TYPE]

Examples:
- HELP RESCUE (for evacuation assistance)
- HELP FOOD (for food and water)
- HELP MEDICAL (for medical assistance)

Include your address or location description if possible.`;

    // Create a blob and download it
    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-sms-instructions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Instructions saved",
      description: "Emergency SMS instructions have been downloaded to your device.",
    });
  };
  
  return (
    <div className="mb-6">
      <Alert className="border-warning/50 bg-warning/10">
        <WifiOff className="h-4 w-4 text-warning" />
        <AlertTitle className="flex items-center gap-2">
          No Internet? We've got you covered
        </AlertTitle>
        <AlertDescription className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? "Hide SMS Instructions" : "Show SMS Fallback Instructions"}
          </Button>
          
          {showInstructions && (
            <div className="mt-3 space-y-3">
              <p className="text-sm">
                When you have no internet access but still have cellular service, 
                send an SMS to our emergency shortcode:
              </p>
              
              <div className="flex items-center gap-2 my-2">
                <div className="bg-background border border-input rounded-md px-3 py-2 font-mono text-sm flex-1">
                  {shortcode}
                </div>
                <Button size="sm" onClick={handleCopyShortcode}>Copy</Button>
              </div>
              
              <p className="text-sm font-medium">SMS Format:</p>
              <div className="bg-background border border-input rounded-md px-3 py-2 font-mono text-sm">
                HELP RESCUE<br />
                HELP FOOD<br />
                HELP MEDICAL
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Include your location details if possible.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="gap-2"
                  onClick={handleSaveInstructions}
                >
                  <Download className="h-4 w-4" /> Save Instructions Offline
                </Button>
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SmsFallbackInfo;
