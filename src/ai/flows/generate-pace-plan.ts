'use server';

/**
 * @fileOverview A Genkit flow to generate a detailed pace plan for a triathlon.
 *
 * - `generatePacePlan` - A function that creates a segmented pace plan for the bike and run.
 * - `PacePlanInput` - The input type for the `generatePacePlan` function.
 * - `PacePlanOutput` - The return type for the `generatePacePlan` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TimeSchema = z.object({
  h: z.number().describe('Hours'),
  m: z.number().describe('Minutes'),
  s: z.number().describe('Seconds'),
});

const PacePlanInputSchema = z.object({
  distance: z
    .enum(['full', 'half', 'olympic', 'sprint'])
    .describe('The distance of the triathlon.'),
  bikeTime: TimeSchema.describe('The total target bike time.'),
  runTime: TimeSchema.describe('The total target run time.'),
});
export type PacePlanInput = z.infer<typeof PacePlanInputSchema>;

const SplitSchema = z.object({
    segment: z.string().describe('The distance segment (e.g., "0-20 km").'),
    targetTime: z.string().describe('The target time for this segment (e.g., "00:40:00").'),
    targetPace: z.string().describe('The target pace for this segment (e.g., "30.0 km/h" or "5:45 min/km").'),
    tip: z.string().describe('A coaching tip or focus for this segment.'),
});

const PacePlanOutputSchema = z.object({
  bikePlan: z.array(SplitSchema).describe('The detailed pacing plan for the bike leg.'),
  runPlan: z.array(SplitSchema).describe('The detailed pacing plan for the run leg.'),
});
export type PacePlanOutput = z.infer<typeof PacePlanOutputSchema>;


export async function generatePacePlan(
  input: PacePlanInput
): Promise<PacePlanOutput> {
  return generatePacePlanFlow(input);
}

const generatePacePlanPrompt = ai.definePrompt({
    name: 'generatePacePlanPrompt',
    input: { schema: PacePlanInputSchema },
    output: { schema: PacePlanOutputSchema },
    prompt: `You are an expert triathlon coach creating a detailed race day pace plan.

The athlete is competing in a {{distance}} distance triathlon.
Their target bike time is {{bikeTime.h}}h {{bikeTime.m}}m {{bikeTime.s}}s.
Their target run time is {{runTime.h}}h {{runTime.m}}m {{runTime.s}}s.

Create a segmented pace plan for the bike and run legs. The goal is to maintain a steady effort, avoiding starting too fast and fading later.

Race Distances:
- Full: 180km bike, 42.2km run
- Half: 90km bike, 21.1km run
- Olympic: 40km bike, 10km run
- Sprint: 20km bike, 5km run

Instructions:
1.  **Bike Plan:**
    -   Break the bike leg into appropriate segments based on the total distance (e.g., every 20-30km for a full, 10-20km for a half, 5-10km for olympic/sprint).
    -   For each segment, calculate the target time and average speed (km/h).
    -   Provide a short, actionable tip for each segment (e.g., focusing on nutrition, maintaining cadence, handling hills).
2.  **Run Plan:**
    -   Break the run leg into appropriate segments (e.g., every 5km for a full/half, 2.5km for olympic, 1km for sprint).
    -   For each segment, calculate the target time and average pace (min/km).
    -   Provide a short, actionable tip for each segment (e.g., focusing on form, hydration, mental strategy).

The sum of the segment times should equal the total target time for each discipline. Be realistic with the pacing; a slight negative split (getting slightly faster) on the run is ideal but hard to execute, so a steady or very slightly fading pace is more realistic for most.

Return the plan in the specified JSON format.
`,
});

const generatePacePlanFlow = ai.defineFlow(
  {
    name: 'generatePacePlanFlow',
    inputSchema: PacePlanInputSchema,
    outputSchema: PacePlanOutputSchema,
  },
  async (input) => {
    const { output } = await generatePacePlanPrompt(input);
    return output!;
  }
);
