'use server';

/**
 * @fileOverview AI-powered tool to predict stock depletion rates and provide timely reorder alerts.
 *
 * - predictStockDepletion - A function that handles the stock depletion prediction process.
 * - PredictStockDepletionInput - The input type for the predictStockDepletion function.
 * - PredictStockDepletionOutput - The return type for the predictStockDepletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictStockDepletionInputSchema = z.object({
  materialName: z.string().describe('The name of the material.'),
  initialStockLevel: z.number().describe('The initial stock level of the material.'),
  dailyUsageRate: z.number().describe('The average daily usage rate of the material.'),
  leadTimeDays: z.number().describe('The lead time in days for reordering the material.'),
  projectId: z.string().describe('The project ID'),
});
export type PredictStockDepletionInput = z.infer<typeof PredictStockDepletionInputSchema>;

const PredictStockDepletionOutputSchema = z.object({
  predictedDepletionDate: z.string().describe('The predicted date when the stock will be depleted.'),
  reorderQuantity: z.number().describe('The recommended reorder quantity to avoid shortages.'),
  reorderAlert: z.string().describe('The text of the reorder alert, suggesting when to reorder.'),
});
export type PredictStockDepletionOutput = z.infer<typeof PredictStockDepletionOutputSchema>;

export async function predictStockDepletion(input: PredictStockDepletionInput): Promise<PredictStockDepletionOutput> {
  return predictStockDepletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictStockDepletionPrompt',
  input: {schema: PredictStockDepletionInputSchema},
  output: {schema: PredictStockDepletionOutputSchema},
  prompt: `You are an AI assistant helping project admins manage stock levels and avoid material shortages.

  Given the following information, predict the stock depletion date, recommend a reorder quantity, and generate a reorder alert:

  Material Name: {{{materialName}}}
  Initial Stock Level: {{{initialStockLevel}}}
  Daily Usage Rate: {{{dailyUsageRate}}}
  Lead Time (Days): {{{leadTimeDays}}}
  Project ID: {{{projectId}}}

  Consider the lead time when recommending a reorder date. The reorder alert should clearly state when to reorder the material to avoid shortages.

  Ensure the predictedDepletionDate is formatted as YYYY-MM-DD.

  Output MUST be a JSON object.
  `,
});

const predictStockDepletionFlow = ai.defineFlow(
  {
    name: 'predictStockDepletionFlow',
    inputSchema: PredictStockDepletionInputSchema,
    outputSchema: PredictStockDepletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
