'use server';
/**
 * @fileOverview An AI flow to generate a summary of a project's status.
 *
 * - summarizeProject - A function that handles the project summary generation.
 * - SummarizeProjectInput - The input type for the summarizeProject function.
 * - SummarizeProjectOutput - The return type for the summarizeProject function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  dueDate: z.string(),
});

const SummarizeProjectInputSchema = z.object({
  name: z.string().describe('The name of the project.'),
  description: z.string().describe('A brief description of the project.'),
  progress: z.number().describe('The overall completion percentage of the project.'),
  budget: z.number().describe('The total budget for the project.'),
  spent: z.number().describe('The amount of the budget already spent.'),
  status: z.string().describe('The current status of the project (e.g., On Track, Delayed).'),
  tasks: z.array(TaskSchema).describe('The list of tasks associated with the project.'),
});
export type SummarizeProjectInput = z.infer<typeof SummarizeProjectInputSchema>;

const SummarizeProjectOutputSchema = z.object({
  summary: z.string().describe("A concise, insightful summary of the project's status, health, and potential risks."),
});
export type SummarizeProjectOutput = z.infer<typeof SummarizeProjectOutputSchema>;

export async function summarizeProject(input: SummarizeProjectInput): Promise<SummarizeProjectOutput> {
  return summarizeProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProjectPrompt',
  input: {schema: SummarizeProjectInputSchema},
  output: {schema: SummarizeProjectOutputSchema},
  prompt: `You are an expert project manager AI. Analyze the following project data and provide a concise, insightful summary.

Your summary should cover:
- Overall project health and progress against the plan.
- Budget status (are they over/under budget?).
- Key upcoming tasks or potential blockers based on the task list.
- Any risks you identify from the data.

Project Name: {{{name}}}
Description: {{{description}}}
Status: {{{status}}}
Progress: {{{progress}}}%
Budget: \${{{budget}}}
Spent: \${{{spent}}}

Tasks:
{{#each tasks}}
- {{this.title}} (Status: {{this.status}}, Due: {{this.dueDate}})
{{/each}}

Generate a summary that would be useful for a project stakeholder who needs a quick update.
`,
});

const summarizeProjectFlow = ai.defineFlow(
  {
    name: 'summarizeProjectFlow',
    inputSchema: SummarizeProjectInputSchema,
    outputSchema: SummarizeProjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
