import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const registerPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty" : "Vui lòng nhập họ tên!",
        "string.min" : "Họ tên phải có ít nhất 5 ký tự!",
        "string.max" : "Họ tên không được vượt quá 50 ký tự!",
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty" : "Vui lòng nhập email!",
        "string.email" : "Email không đúng định dạng!",
      }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if(!/[A-Z]/.test(value)){
          return helpers.error("password.uppercase")
        }
        if(!/[a-z]/.test(value)){
          return helpers.error("password.lowercase")
        }
        if(!/[0-9]/.test(value)){
          return helpers.error("password.number")
        }
        if(!/[!@#$%^&*(),.?":{}|<>]/.test(value)){
          return helpers.error("password.special")
        }
        return value;
      })
      .messages({
        "string.empty" : "Vui lòng nhập mật khẩu!",
        "string.min" : "Mật khẩu phải có ít nhất 8 ký tự!",
        "password.uppercase" : "Mật khẩu cần tối thiểu 1 chữ cái viết hoa!",
        "password.lowercase" : "Mật khẩu cần tối thiểu 1 chữ cái viết thường!",
        "password.number" : "Mật khẩu cần tối thiểu 1 chữ số!",
        "password.special" : "Mật khẩu cần tối thiểu 1 ký tự đặc biệt!",
      }),

  })

  const { error } = schema.validate(req.body);

  if(error){
    res.json({
      code: "error",
      message: error.details[0].message
    })
    return;
  }
  next();
}

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty" : "Vui lòng nhập email!",
        "string.email" : "Email không đúng định dạng!",
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.empty" : "Vui lòng nhập mật khẩu!",
      }),

  })

  const { error } = schema.validate(req.body);

  if(error){
    res.json({
      code: "error",
      message: error.details[0].message
    })
    return;
  }
  next();
}

export const profilePath = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty" : "Vui lòng nhập họ tên!",
        "string.min" : "Họ tên phải có ít nhất 5 ký tự!",
        "string.max" : "Họ tên không được vượt quá 50 ký tự!",
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty" : "Vui lòng nhập email!",
        "string.email" : "Email không đúng định dạng!",
      }),
    avatar: Joi.string().allow(''),
    phone: Joi.string().allow(''),
  })

  const { error } = schema.validate(req.body);

  if(error){
    res.json({
      code: "error",
      message: error.details[0].message
    })
    return;
  }
  next();
}