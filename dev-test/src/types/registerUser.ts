import * as joi from 'joi';
export const registerUserSchema = joi.object({
  username: joi
    .string()
    .example('marik8998@gmail.com')
    .max(254)
    .trim()
    .regex(/^\s*(?:([A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})\b\s*)+$/i)
    .required()
    .email(),
  password: joi.string().example('N1fL@123').min(8).max(64).required(),
});
