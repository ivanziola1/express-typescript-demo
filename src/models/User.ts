import Joi from "joi";
import jwt from "jsonwebtoken";

export interface CreateUser {
  id: number;
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
}

export interface SafeUser {
  id: number;
  email: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}


export const generateAuthToken = (user: SafeUser): string => {
  if (!process.env.JWTPRIVATEKEY) {
    throw new Error("JWT secret is not configured")
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWTPRIVATEKEY);
  return token;
};

export const validateUser = (user: CreateUser): Joi.ValidationResult => {
  const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(15).required(),
      passwordConfirmation: Joi.any().equal(Joi.ref('password'))
      .required()
      // .label('passwordConfirmation')
      .messages({ 'any.only': '{{#label}} does not match' }),
  });
  return schema.validate(user);
};

export const validateLogin = (user: LoginData): Joi.ValidationResult => {
  const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
  });
  return schema.validate(user);
};

