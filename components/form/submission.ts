import {z} from 'zod';

declare module '#auth-utils' {
    interface User {
        email: string,
        id: number,
    }
}

export type FieldKey = keyof Fields;

export const FieldsSchema = z.object({
    name: z.string(),
    length: z.number(),
    pier_width: z.string(),
    pier_height: z.number(),
    // max_height: z.number(),
    panel_height: z.number(),
    panel_thickness: z.number(),
    pier_spacing: z.enum(['num_piers', 'distance', 'absolute_dist']),
    num_piers: z.number().nullable().optional(),
    space_betw_piers: z.number().nullable().optional(),
    space_betw_piers_abs: z.number().nullable().optional(),
    different_final_spacing: z.enum(['left', 'right']).nullable().optional(),
    is_gradient: z.enum(['yes', 'no']),
    gradient: z.number().nullable().optional(),
    rise: z.number().nullable().optional(),
    run: z.number().nullable().optional(),
    comments: z.string().nullable().optional(),
}).strip();

export type Fields = z.infer<typeof FieldsSchema>;