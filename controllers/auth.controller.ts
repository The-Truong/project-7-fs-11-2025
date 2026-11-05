import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import jwt from 'jsonwebtoken';

export const check = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm token!"
      })
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;
    
    const existAccount = await AccountUser.findOne({
      _id: id,
      email: email,
    })

    if(!existAccount){
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      })
      return;
    }

    const infoUser = {
      id: existAccount.id,
      email: existAccount.email,
      fullName: existAccount.fullName,
    };

    res.json({
      code: "success",
      message: "Thành công!",
      infoUser: infoUser,
    })

  } catch (error) {
    console.log(error);
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    })
  }
}