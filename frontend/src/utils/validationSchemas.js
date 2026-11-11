import { z } from 'zod';
import { GROUP_NAME_LENGTH, MIN_PASSWORD_LENGTH, ROLES, SUBMISSION_TYPES } from '@/utils/constants';
import { isValidOneDriveLink } from '@/utils/links';

const requiredEmail = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address, such as name@example.com.');

const passwordRule = z
  .string()
  .min(1, 'Password is required.')
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);

export const loginSchema = z.object({
  email: requiredEmail,
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(60, 'Full name must be 60 characters or fewer.'),
    email: requiredEmail,
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    role: z.enum([ROLES.STUDENT, ROLES.PROFESSOR], { message: 'Select whether you are a Student or a Professor.' }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: requiredEmail,
});

export const assignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters.')
    .max(120, 'Title must be 120 characters or fewer.'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters.')
    .max(1000, 'Description must be 1000 characters or fewer.'),
  deadlineDate: z.string().min(1, 'Deadline date is required.'),
  deadlineTime: z.string().min(1, 'Deadline time is required.'),
  oneDriveLink: z
    .string()
    .trim()
    .min(1, 'OneDrive link is required.')
    .refine(isValidOneDriveLink, 'Enter a valid OneDrive link (for example, https://1drv.ms/... or https://onedrive.live.com/...).'),
  submissionType: z.enum([SUBMISSION_TYPES.INDIVIDUAL, SUBMISSION_TYPES.GROUP], {
    message: 'Choose a submission type.',
  }),
});

export const groupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(GROUP_NAME_LENGTH.min, `Group name must be at least ${GROUP_NAME_LENGTH.min} characters.`)
    .max(GROUP_NAME_LENGTH.max, `Group name must be ${GROUP_NAME_LENGTH.max} characters or fewer.`),
});
