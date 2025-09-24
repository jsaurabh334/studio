'use server';
/**
 * @fileOverview An AI flow to generate a list of tasks from a project goal.
 *
 * - generateTasksForGoal - A function that generates tasks.
 * - GenerateTasksInput - The input type for the function.
 * - GenerateTasksOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  title: z.string().describe('The clear and concise title of the task.'),
});

const GenerateTasksInputSchema = z.object({
  goal: z.string().describe('The high-level project goal to be broken down.'),
});
export type GenerateTasksInput = z.infer<typeof GenerateTasksInputSchema>;

const GenerateTasksOutputSchema = z.object({
  tasks: z.array(TaskSchema).describe('An array of generated tasks.'),
});
export type GenerateTasksOutput = z.infer<typeof GenerateTasksOutputSchema>;

export async function generateTasksForGoal(input: GenerateTasksInput): Promise<GenerateTasksOutput> {
  return generateTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTasksPrompt',
  input: {schema: GenerateTasksInputSchema},
  output: {schema: GenerateTasksOutputSchema},
  prompt: `You are an expert project manager for civil engineering projects. A user will provide a high-level goal, and your job is to break it down into a list of smaller, actionable tasks.

Goal: {{{goal}}}

Generate a list of tasks that need to be completed to achieve this goal. The tasks should be clear, concise, and logical.
`,
});

const generateTasksFlow = ai.defineFlow(
  {
    name: 'generateTasksFlow',
    inputSchema: GenerateTasksInputSchema,
    outputSchema: GenerateTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
