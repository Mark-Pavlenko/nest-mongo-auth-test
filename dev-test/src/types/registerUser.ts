import * as joi from 'joi';
export const registerUserSchema = joi.object({
  username: joi
    .string()
    .example('marik8998@gmail.com')
    .max(254)
    .trim()
    .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .required()
    .email(),
  password: joi.string().example('N1fL@123').min(8).max(64).required(),
});
