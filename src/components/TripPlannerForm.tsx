import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Wallet, Heart, Sparkles, Loader2 } from "lucide-react";

interface TripPlannerFormProps {
  onSubmit: (data: TripData) => void;
  isLoading: boolean;
}

export interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
}

const interestOptions = [
  { id: "culture", label: "Culture & History", emoji: "🏛️" },
  { id: "food", label: "Food & Dining", emoji: "🍽️" },
  { id: "adventure", label: "Adventure", emoji: "🏔️" },
  { id: "relaxation", label: "Relaxation", emoji: "🧘" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "photography", label: "Photography", emoji: "📸" },
];

const budgetOptions = [
  { value: "budget", label: "Budget", description: "Under $100/day" },
  { value: "moderate", label: "Moderate", description: "$100-250/day" },
  { value: "luxury", label: "Luxury", description: "$250+/day" },
];

export const TripPlannerForm = ({ onSubmit, isLoading }: TripPlannerFormProps) => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate || !budget || selectedInterests.length === 0) {
      return;
    }
    onSubmit({
      destination,
      startDate,
      endDate,
      budget,
      interests: selectedInterests,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <Label htmlFor="destination" className="flex items-center gap-2 text-base font-medium">
          <MapPin className="w-5 h-5 text-primary" />
          Where do you want to go?
        </Label>
        <Input
          id="destination"
          placeholder="e.g., Tokyo, Japan"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-12 text-base bg-card border-border/50 focus:border-primary focus:ring-primary/20"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="space-y-3">
          <Label htmlFor="startDate" className="flex items-center gap-2 text-base font-medium">
            <Calendar className="w-5 h-5 text-primary" />
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12 text-base bg-card border-border/50 focus:border-primary focus:ring-primary/20"
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="endDate" className="flex items-center gap-2 text-base font-medium">
            <Calendar className="w-5 h-5 text-primary" />
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-12 text-base bg-card border-border/50 focus:border-primary focus:ring-primary/20"
            required
          />
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Label className="flex items-center gap-2 text-base font-medium">
          <Wallet className="w-5 h-5 text-primary" />
          What's your budget?
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setBudget(option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                budget === option.value
                  ? "border-primary bg-primary/10 shadow-soft"
                  : "border-border/50 bg-card hover:border-primary/50"
              }`}
            >
              <div className="font-semibold text-foreground">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Label className="flex items-center gap-2 text-base font-medium">
          <Heart className="w-5 h-5 text-primary" />
          What are you interested in?
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                selectedInterests.includes(interest.id)
                  ? "border-primary bg-primary/10 shadow-soft"
                  : "border-border/50 bg-card hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{interest.emoji}</span>
              <span className="text-sm font-medium text-foreground">{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full animate-slide-up"
        style={{ animationDelay: "0.5s" }}
        disabled={isLoading || !destination || !startDate || !endDate || !budget || selectedInterests.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Your Perfect Trip...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate My Itinerary
          </>
        )}
      </Button>
    </form>
  );
};
