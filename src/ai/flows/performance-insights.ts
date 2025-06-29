// Implemented a Genkit flow to provide performance insights on which discipline to focus on for improvement.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing performance insights
 * for Ironman triathletes, suggesting which discipline to focus on for improvement.
 *
 * - `getPerformanceInsights` -  A function that analyzes inputted triathlon times and
 *    suggests the best discipline to focus on for improvement.
 * - `PerformanceInsightsInput` - The input type for the `getPerformanceInsights` function.
 * - `PerformanceInsightsOutput` - The return type for the `getPerformanceInsights` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceInsightsInputSchema = z.object({
  swimTime: z.number().describe('Swim time in minutes.'),
  bikeTime: z.number().describe('Bike time in minutes.'),
  runTime: z.number().describe('Run time in minutes.'),
  t1Time: z.number().describe('Transition 1 time (swim to bike) in minutes.'),
  t2Time: z.number().describe('Transition 2 time (bike to run) in minutes.'),
});
export type PerformanceInsightsInput = z.infer<typeof PerformanceInsightsInputSchema>;

const PerformanceInsightsOutputSchema = z.object({
  insight: z.string().describe('AI-powered insight on which discipline to focus on for improvement.'),
});
export type PerformanceInsightsOutput = z.infer<typeof PerformanceInsightsOutputSchema>;

export async function getPerformanceInsights(input: PerformanceInsightsInput): Promise<PerformanceInsightsOutput> {
  return performanceInsightsFlow(input);
}

const performanceInsightsPrompt = ai.definePrompt({
  name: 'performanceInsightsPrompt',
  input: {schema: PerformanceInsightsInputSchema},
  output: {schema: PerformanceInsightsOutputSchema},
  prompt: `You are an expert triathlon coach analyzing an athlete's Ironman performance.

  Based on the following times (in minutes) for each segment of the race, provide a single, actionable insight
  on which discipline (swim, bike, or run) the athlete should focus on improving to maximize their overall performance.
  Explain your reasoning based on typical Ironman pacing strategies and the relative impact of improvements in each discipline.

  Swim Time: {{{swimTime}}}
  Bike Time: {{{bikeTime}}}
  Run Time: {{{runTime}}}
  T1 Time: {{{t1Time}}}
  T2 Time: {{{t2Time}}}

  Focus your insight on one discipline only. Do not advise on transitions, only swim, bike or run. Be concise.
  Your entire output should be no more than 2 sentences.`,
});

const performanceInsightsFlow = ai.defineFlow(
  {
    name: 'performanceInsightsFlow',
    inputSchema: PerformanceInsightsInputSchema,
    outputSchema: PerformanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await performanceInsightsPrompt(input);
    return output!;
  }
);
