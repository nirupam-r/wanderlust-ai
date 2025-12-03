import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, startDate, endDate, budget, interests } = await req.json();
    
    console.log('Generating itinerary for:', { destination, startDate, endDate, budget, interests });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert travel planner with extensive knowledge of destinations worldwide. 
Create detailed, personalized travel itineraries that are practical and inspiring.

When creating itineraries:
- Structure each day with morning, afternoon, and evening activities
- Include specific restaurant and attraction recommendations
- Add practical tips like best times to visit, estimated costs, and transportation options
- Consider the traveler's budget and interests
- Include hidden gems and local favorites, not just tourist spots
- Add estimated time for each activity

Format your response as a JSON object with this structure:
{
  "summary": "A brief exciting summary of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Detailed description",
          "tip": "Optional practical tip",
          "estimatedCost": "$XX"
        }
      ]
    }
  ],
  "packingTips": ["tip1", "tip2"],
  "budgetBreakdown": {
    "accommodation": "$XX/night",
    "food": "$XX/day",
    "activities": "$XX total",
    "transportation": "$XX total"
  }
}`;

    const userPrompt = `Create a personalized travel itinerary for:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Budget: ${budget}
- Interests: ${interests.join(', ')}

Please create a day-by-day itinerary that matches these preferences. Make it exciting and detailed!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extract JSON from the response
    let itinerary;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse itinerary JSON:', parseError);
      // Return raw content if parsing fails
      itinerary = { raw: content };
    }

    console.log('Successfully generated itinerary');

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate itinerary' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
