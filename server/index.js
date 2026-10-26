require("dotenv").config(); //dotenv ka kaam hai:(.env file se variables read karke unhe Node.js ke environment mein available karna.)
//Uske baad hum apni API key ko directly key likhe bina access kar sakte hain
const express = require("express"); //express ek tool/library hai jo humein backend server banane mein help karta hai.

//cors() backend ko allow karta hai ki frontend usse request kar sake.
const cors = require("cors");

//Humne jo openai package install kiya tha, usko apne backend mein use kar rahe hain.
const OpenAI = require("openai");

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.use(cors());

//Backend ko bol rahe hain ki agar request mein JSON data aaye, toh usse read/understand karna.
app.use(express.json());

const PORT = 5000;

app.post("/api/generate-trip", async (req, res) => {
  const tripData = req.body;

  console.log(tripData);

  const prompt = `
    Create a personalized travel plan based on the following trip details:
   
    Destination: ${tripData.destination}
    Budget: ${tripData.budget}
    Start Date: ${tripData.startDate}
    End Date: ${tripData.endDate}
    Travelers: ${tripData.travelers}
    Travel Type: ${tripData.travelType}

    Return ONLY valid JSON. Do not add markdown, code fences, explanantions, or any text outside the JSON.

    Use exactly this structure:

    {
    "tripTitle": "A creative title for the trip",
    "vibe": "A short description of the travel vibe",
    "duration": 0,
    "dailyBudget": 0,
    "itinerary": [
    {
    "day": 1,
    "morning": "Morning activity",
    "afternoon": "Afternoon activity",
    "evening": "Evening activity",
    "estimatedCost": 0
    }
    ],
    
    "budgetBreakdown": {
    "stay": 0,
    "food": 0,
    "activities": 0,
    "transport": 0
    },

    "packingList": [
    "item 1",
    "item 2"
    ],
    "tips": [
    "tip 1",
    "tip 2"
    ]
    }

    Requirements:
- The estimatedCost for each day must reflect the actual activities, meals, accommodation, and transport planned for that day, so daily costs may vary and should not be identical unless the trip genuinely requires identical daily spending.
- The user's total available budget is exactly ${tripData.budget} INR.
- The total estimated trip cost, calculated from the budget breakdown, must never exceed ${tripData.budget} INR.
- The sum of stay, food, activities, and transport must be less than or equal to ${tripData.budget} INR.
- Calculate the exact number of days from the start date to the end date.
- Create exactly one itinerary object for each day.
- Keep the itinerary appropriate for the destination and travel type.
- The sum of all daily estimatedCost values must be less than or equal to ${tripData.budget} INR.
- dailyBudget must be calculated as the total estimated trip cost divided by the number of days.
- estimatedCost for each day must be a realistic daily cost.
- dailyBudget must be calculated as the total estimated trip cost divided by the number of days.
- Keep at least 5% of the user's budget unallocated as an emergency buffer when possible.
- All cost values must be numbers, not strings.
- duration and day must be numbers.
- Do not invent extremely expensive costs that are unrealistic for the given budget.
    `;

  // const response= await client.responses.create({
  //     model: "openrouter/free",
  //     input: prompt,
  // });

  // res.json({
  //     message:"Trip data recieved",
  //     //Jo text AI ne generate kiya hai, woh mujhe de do
  //     data: response.output_text,

  //     //data: tripData,
  // });

  try {
    console.log("Sending request to OpenRouter...");
    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "travel_plan",
          strict: true,
          schema: {
            type: "object",
            properties: {
              tripTitle: {
                type: "string",
              },
              vibe: {
                type: "string",
              },
              duration: {
                type: "number",
              },
              dailyBudget: {
                type: "number",
              },
              itinerary: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: {
                      type: "number",
                    },
                    morning: {
                      type: "string",
                    },
                    afternoon: {
                      type: "string",
                    },
                    evening: {
                      type: "string",
                    },
                    estimatedCost: {
                      type: "number",
                    },
                  },
                  required: [
                    "day",
                    "morning",
                    "afternoon",
                    "evening",
                    "estimatedCost",
                  ],
                  additionalProperties: false,
                },
              },
              budgetBreakdown: {
                type: "object",
                properties: {
                  stay: { type: "number" },
                  food: { type: "number" },
                  activities: { type: "number" },
                  transport: { type: "number" },
                },
                required: ["stay", "food", "activities", "transport"],
                additionalProperties: false,
              },
              packingList: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              tips: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "tripTitle",
              "vibe",
              "duration",
              "dailyBudget",
              "itinerary",
              "budgetBreakdown",
              "packingList",
              "tips",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    console.log("Response received from OpenRouter!");
    console.log("AI MESSAGE:", response.choices[0].message);

    res.json({
      message: "Trip data recieved",
      data: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenRouter Error:", error);

    res.status(500).json({
      message: "Failed to generate itinerary",
      error: error.message,
    });
  }
});

// Regenerate a single day of the itinerary
app.post("/api/regenerate-day", async (req, res) => {
  const { tripData, selectedDay, currentDay } = req.body;

  if (!tripData || !selectedDay || !currentDay) {
    return res.status(400).json({
      message: "Trip details, selected day and current day are required.",
    });
  }

  const prompt = `
    Regenerate ONLY day ${selectedDay} of this travel itinerary.

    Trip details:
    Destination: ${tripData.destination}
    Total budget: ${tripData.budget} INR
    Start date: ${tripData.startDate}
    End date: ${tripData.endDate}
    Travelers: ${tripData.travelers}
    Travel type: ${tripData.travelType}

    Current day:
    ${JSON.stringify(currentDay)}

    Create fresh, useful activities appropriate for the destination
    and travel type. Make the activities different from the current
    plan where practical.

    Return ONLY valid JSON with exactly these fields:
    {
      "day": ${selectedDay},
      "morning": "Morning activity",
      "afternoon": "Afternoon activity",
      "evening": "Evening activity",
      "estimatedCost": 0
    }

    All costs must be numbers in INR.
    Keep the day number unchanged.
    Do not include any other days or additional fields.
  `;

  try {
    console.log(`Regenerating day ${selectedDay}...`);

    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "regenerated_day",
          strict: true,
          schema: {
            type: "object",
            properties: {
              day: { type: "number" },
              morning: { type: "string" },
              afternoon: { type: "string" },
              evening: { type: "string" },
              estimatedCost: { type: "number" },
            },
            required: [
              "day",
              "morning",
              "afternoon",
              "evening",
              "estimatedCost",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    res.json({
      message: "Day regenerated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Day regeneration error:", error);

    res.status(500).json({
      message: "Failed to regenerate day",
      error: error.message,
    });
  }
});

//Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Tripwise backend is working!",
  });
});

//Express, server start karo aur port 5000 par listen karo.
app.listen(PORT, () => {
  //app.listen(...) Ye server ko actually start karta hai.
  console.log(`Server running on port ${PORT}`);
});
