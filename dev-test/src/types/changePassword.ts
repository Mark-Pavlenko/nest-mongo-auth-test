import * as joi from 'joi';
export const changePasswordSchema = joi.object({
  oldPassword: joi.string().example('N1fL@123').min(8).max(64).required(),
  newPassword: joi.string().example('N2fL@456').min(8).max(64).required(),
});
