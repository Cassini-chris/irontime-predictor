'use server';

/**
 * @fileOverview This file defines a Genkit flow for distributing a total goal time
 * into realistic swim, bike, and run splits for a triathlon of a given distance.
 *
 * - `distributeGoalTime` -  A function that takes a total goal time and race distance
 *    and returns a plausible distribution for each discipline.
 * - `DistributeGoalTimeInput` - The input type for the `distributeGoalTime` function.
 * - `DistributeGoalTimeOutput` - The return type for the `distributeGoalTime` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TimeSchema = z.object({
  h: z.number().describe('Hours'),
  m: z.number().describe('Minutes'),
  s: z.number().describe('Seconds'),
});

export const DistributeGoalTimeInputSchema = z.object({
  goalTime: TimeSchema.describe('The total goal time for the race.'),
  distance: z
    .enum(['full', 'half', 'olympic', 'sprint'])
    .describe('The distance of the triathlon.'),
});
export type DistributeGoalTimeInput = z.infer<
  typeof DistributeGoalTimeInputSchema
>;

export const DistributeGoalTimeOutputSchema = z.object({
  swimTime: TimeSchema.describe('The calculated swim time.'),
  bikeTime: TimeSchema.describe('The calculated bike time.'),
  runTime: TimeSchema.describe('The calculated run time.'),
});
export type DistributeGoalTimeOutput = z.infer<
  typeof DistributeGoalTimeOutputSchema
>;

export async function distributeGoalTime(
  input: DistributeGoalTimeInput
): Promise<DistributeGoalTimeOutput> {
  return distributeGoalTimeFlow(input);
}

const distributeGoalTimePrompt = ai.definePrompt({
  name: 'distributeGoalTimePrompt',
  input: { schema: DistributeGoalTimeInputSchema },
  output: { schema: DistributeGoalTimeOutputSchema },
  prompt: `You are an expert triathlon coach. A user wants to achieve a goal time for a specific race distance. Your task is to distribute their total goal time into realistic splits for swim, bike, and run.

The user's goal time is {{goalTime.h}} hours, {{goalTime.m}} minutes, and {{goalTime.s}} seconds for a {{distance}} distance triathlon.

Here are some general guidelines for time distribution percentages, but use your expertise to create a plausible and balanced plan. The transitions (T1 and T2) are not included in this calculation, so the sum of swim, bike, and run should be slightly less than the total goal time to allow for transitions. For a {{distance}} race, a reasonable total transition time might be between 2% and 5% of the total time.

- Full Distance: Swim ~10-13%, Bike ~50-55%, Run ~32-38%
- Half Distance: Swim ~8-12%, Bike ~52-56%, Run ~30-35%
- Olympic Distance: Swim ~12-16%, Bike ~48-52%, Run ~28-32%
- Sprint Distance: Swim ~13-18%, Bike ~45-50%, Run ~25-30%

Based on the user's goal time of {{goalTime.h}}h {{goalTime.m}}m {{goalTime.s}}s for a {{distance}} race, calculate and return the times for each discipline. Ensure the sum of the discipline times is slightly less than the total goal time to account for transitions. Return the result in the specified JSON format with h, m, and s for each discipline.
`,
});

const distributeGoalTimeFlow = ai.defineFlow(
  {
    name: 'distributeGoalTimeFlow',
    inputSchema: DistributeGoalTimeInputSchema,
    outputSchema: DistributeGoalTimeOutputSchema,
  },
  async (input) => {
    const { output } = await distributeGoalTimePrompt(input);
    return output!;
  }
);
