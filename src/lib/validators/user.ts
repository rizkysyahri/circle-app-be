import Joi from "joi";
import { ILogin, IRegister } from "../../types/app";

export const registerValidator = Joi.object<IRegister>({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
});

// export const loginValidator = Joi.object<ILogin>({
//   username: Joi.string().required(),
//   password: Joi.string().required(),
// });
