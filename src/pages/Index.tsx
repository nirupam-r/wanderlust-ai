import { useState } from "react";
import { TripPlannerForm, TripData } from "@/components/TripPlannerForm";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plane, Globe, Compass } from "lucide-react";

const Index = () => {
  const [itinerary, setItinerary] = useState<any>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: TripData) => {
    setIsLoading(true);
    setTripData(data);

    try {
      const { data: response, error } = await supabase.functions.invoke('generate-itinerary', {
        body: data,
      });

      if (error) {
        throw error;
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      setItinerary(response.itinerary);
      toast({
        title: "Itinerary Created! ✈️",
        description: `Your personalized trip to ${data.destination} is ready.`,
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Oops! Something went wrong",
        description: error instanceof Error ? error.message : "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setItinerary(null);
    setTripData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-float">
          <Plane className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 animate-float" style={{ animationDelay: "2s" }}>
          <Globe className="w-20 h-20 text-secondary" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20 animate-float" style={{ animationDelay: "4s" }}>
          <Compass className="w-12 h-12 text-accent" />
        </div>

        <div className="relative container mx-auto px-4 py-12 sm:py-20">
          {!itinerary ? (
            <>
              {/* Header */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Plane className="w-4 h-4" />
                  AI-Powered Travel Planning
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
                  Your Dream Trip,{" "}
                  <span className="text-gradient">Perfectly Planned</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Tell me your destination, dates, budget, and interests. 
                  I'll craft a personalized itinerary just for you.
                </p>
              </div>

              {/* Form Card */}
              <div className="max-w-2xl mx-auto">
                <div className="glass rounded-2xl p-6 sm:p-8 shadow-elevated">
                  <TripPlannerForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
                {[
                  { 
                    icon: "🎯", 
                    title: "Personalized", 
                    desc: "Tailored to your interests and preferences" 
                  },
                  { 
                    icon: "💡", 
                    title: "Smart Tips", 
                    desc: "Local insights and hidden gems" 
                  },
                  { 
                    icon: "💰", 
                    title: "Budget Aware", 
                    desc: "Plans that match your spending style" 
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="text-center p-6 rounded-xl bg-card/50 border border-border/50"
                  >
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <ItineraryDisplay 
              itinerary={itinerary} 
              destination={tripData?.destination || ""} 
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Plan smarter, travel better</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
