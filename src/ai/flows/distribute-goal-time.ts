'use server';

/**
 * @fileOverview This file defines a Genkit flow for distributing a total goal time
 * into realistic swim, bike, and run splits for a triathlon of a given distance,
 * considering course profile and athlete bias.
 *
 * - `distributeGoalTime` -  A function that takes a total goal time, race distance,
 *    course profile, and athlete bias and returns a plausible distribution for each discipline.
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

const DistributeGoalTimeInputSchema = z.object({
  goalTime: TimeSchema.describe('The total goal time for the race.'),
  distance: z
    .enum(['full', 'half', 'olympic', 'sprint'])
    .describe('The distance of the triathlon.'),
  courseProfile: z
    .enum(['flat', 'rolling', 'hilly', 'extreme'])
    .describe('The difficulty profile of the course.'),
  athleteBias: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A slider value from 0-100. 0 is a strong swim/biker, 100 is a strong runner, 50 is balanced.'
    ),
});
export type DistributeGoalTimeInput = z.infer<
  typeof DistributeGoalTimeInputSchema
>;

const DistributeGoalTimeOutputSchema = z.object({
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
  prompt: `You are an expert triathlon coach. A user wants to achieve a goal time for a specific race. Your task is to distribute their total goal time into realistic splits for swim, bike, and run, considering the course profile and the athlete's bias.

The user's goal time is {{goalTime.h}} hours, {{goalTime.m}} minutes, and {{goalTime.s}} seconds for a {{distance}} distance triathlon.

Here are the parameters you must consider:
1.  **Course Profile:** '{{courseProfile}}'. This will significantly impact the bike and run times. A hilly or extreme course will require more time on the bike and run compared to a flat course, for the same effort.
2.  **Athlete Bias:** '{{athleteBias}}' on a scale of 0-100.
    -   A value near 0 indicates a 'strong swim/biker' who is relatively faster in the swim and bike compared to their run.
    -   A value near 100 indicates a 'strong runner' who is relatively faster on the run.
    -   A value of 50 indicates a 'balanced' athlete.

**Your Task:**
Calculate a plausible and intelligent distribution of the total goal time into swim, bike, and run times. The sum of the three disciplines should be slightly less than the total goal time to leave a realistic amount of time for transitions (T1 and T2). For a {{distance}} race, a reasonable total transition time might be between 2% (for 'full' distance) and 5% (for 'sprint' distance) of the total time.

**Example Reasoning:**
- If the course is 'hilly' and the athlete bias is 'strong runner' (e.g., 90), you should allocate a larger percentage of time to the bike (due to hills) but then show their strength with a comparatively faster run split than a balanced athlete would have.
- If the course is 'flat' and the athlete bias is 'strong swim/biker' (e.g., 10), the bike time should be very fast, while the run time might be a bit slower proportionally.

Based on all these factors, calculate and return the times for each discipline. Return the result in the specified JSON format with h, m, and s for each discipline.
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
