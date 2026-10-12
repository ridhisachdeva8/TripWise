import { z } from "zod";

export const tripSchema = z.object({
  destination: z.string().min(3, "Destination must be at least 3 characters"),

  budget: z.number().min(1000, "Budget should be atleast 1000"),

  startDate: z.string().min(1, "Start date is required"),

  endDate: z.string().min(1, "End date is required"),

  travelers: z.number().min(1, "At least one traveler is required"),

  travelType: z.string().min(1, "Please select travel type"),
});

//Abhi tak tum manually likh rahi thi interface
//per z.infer TypeScript, schema dekh aur khud type bana de.
export type CreateTripFormInput = z.input<typeof tripSchema>;
export type CreateTripFormData = z.output<typeof tripSchema>;
