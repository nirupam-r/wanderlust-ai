import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Lightbulb, 
  Luggage, 
  ArrowLeft,
  Sun,
  Sunset,
  Moon
} from "lucide-react";

interface Activity {
  time: string;
  activity: string;
  description: string;
  tip?: string;
  estimatedCost?: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface BudgetBreakdown {
  accommodation: string;
  food: string;
  activities: string;
  transportation: string;
}

interface Itinerary {
  summary: string;
  days: Day[];
  packingTips: string[];
  budgetBreakdown: BudgetBreakdown;
  raw?: string;
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  destination: string;
  onBack: () => void;
}

const getTimeIcon = (time: string) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 12) return <Sun className="w-4 h-4 text-accent" />;
  if (hour < 18) return <Sunset className="w-4 h-4 text-primary" />;
  return <Moon className="w-4 h-4 text-secondary" />;
};

export const ItineraryDisplay = ({ itinerary, destination, onBack }: ItineraryDisplayProps) => {
  // Handle raw response if parsing failed
  if (itinerary.raw) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Plan Another Trip
        </Button>
        <Card className="p-6 bg-card shadow-soft">
          <h2 className="text-2xl font-display font-bold mb-4">Your {destination} Itinerary</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {itinerary.raw}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Plan Another Trip
        </Button>
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-elevated">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Your {destination} Adventure
            </h2>
            <p className="text-muted-foreground leading-relaxed">{itinerary.summary}</p>
          </div>
        </div>
      </Card>

      {/* Days */}
      <div className="space-y-6">
        {itinerary.days?.map((day, dayIndex) => (
          <Card 
            key={day.day} 
            className="p-6 bg-card shadow-soft border-border/50 animate-slide-up"
            style={{ animationDelay: `${dayIndex * 0.1}s` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">{day.day}</span>
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium">Day {day.day}</div>
                <h3 className="text-xl font-display font-semibold text-foreground">{day.title}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {day.activities?.map((activity, actIndex) => (
                <div
                  key={actIndex}
                  className="relative pl-6 pb-4 border-l-2 border-border last:border-0 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    {getTimeIcon(activity.time)}
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                      {activity.estimatedCost && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {activity.estimatedCost}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{activity.activity}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                    {activity.tip && (
                      <div className="mt-2 p-3 rounded-lg bg-accent/20 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{activity.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Budget Breakdown */}
      {itinerary.budgetBreakdown && (
        <Card className="p-6 bg-card shadow-soft border-border/50 animate-slide-up">
          <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Estimated Budget
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(itinerary.budgetBreakdown).map(([key, value]) => (
              <div key={key} className="p-4 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground capitalize mb-1">{key}</div>
                <div className="font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Packing Tips */}
      {itinerary.packingTips && itinerary.packingTips.length > 0 && (
        <Card className="p-6 bg-card shadow-soft border-border/50 animate-slide-up">
          <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <Luggage className="w-5 h-5 text-primary" />
            Packing Tips
          </h3>
          <ul className="space-y-2">
            {itinerary.packingTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
