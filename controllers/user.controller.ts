import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";

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