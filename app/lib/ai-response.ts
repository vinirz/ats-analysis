import { z } from 'zod';

const ExperienceSchema = z.object({
  role: z.string().nullable(),
  company: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

const EducationSchema = z.object({
  institution: z.string().nullable(),
  degree: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

export const ResumeSchema = z.object({
  contact: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    linkedIn: z.string().nullable(),
  }).optional().nullable(),

  skills: z.array(z.string()).optional().default([]),

  experience: z.array(ExperienceSchema).optional().default([]),

  education: z.array(EducationSchema).optional().default([]),

  recomendations: z.array(z.string()).optional().default([]),
});

export type ResumeResponseContent = z.infer<typeof ResumeSchema>;