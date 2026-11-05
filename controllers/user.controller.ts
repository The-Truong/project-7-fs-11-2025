import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountUser.findOne({
      email: req.body.email,
    });
  
    if(existAccount){
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      })
      return;
    }
  
    const salt = bcrypt.genSaltSync(10); // tạo chuỗi ngẫu nhiên 10 ký tự
    req.body.password = bcrypt.hashSync(req.body.password, salt);
  
    const newRecord = new AccountUser(req.body);
    await newRecord.save();
  
    res.json({
      code: "success",
      message: "Đăng ký thành công",
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "success",
      message: "Đã xuất hiện lỗi",
    });
  }
}

export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
      
    const existAccount = await AccountUser.findOne({
      email: email,
    })
  
    if(!existAccount){
      res.json({
        code: "error",
        message: "Email không tồn tại trong hệ thống!",
      })
      return;
    }
    
    const isMatchPassword = await bcrypt.compareSync(password, `${existAccount.password}`);  
    if(!isMatchPassword){
      res.json({
        code: "error",
        message: "Sai mật khẩu!",
      })
      return;
    }
  
    const token = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '1d',
      }
    );
    
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, //chỉ cho phép gửi bên server
      sameSite: 'strict',
    });
  
    res.json({
      code: "success",
      message: "Đăng nhập thành công!",
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "success",
      message: "Đã có lỗi xảy ra!",
    });
  }
}