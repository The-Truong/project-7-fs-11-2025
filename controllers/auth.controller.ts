import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import jwt from 'jsonwebtoken';
import AccountCompany from "../models/account-company.model";

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
    const { id, email, type } = decoded;
    
    // tìm user
    if(type == "user"){
      const existAccountUser = await AccountUser.findOne({
        _id: id,
        email: email,
      })

      if(existAccountUser){
        const infoUser = {
          id: existAccountUser.id,
          email: existAccountUser.email,
          fullName: existAccountUser.fullName,
        };

        res.json({
          code: "success",
          message: "Thành công!",
          infoUser: infoUser,
        })
        return;
      }
    }

    // tìm công ty
    if(type == "company") {
      const existAccountCompany = await AccountCompany.findOne({
        _id: id,
        email: email,
      })

      if(existAccountCompany){
        const infoCompany = {
          id: existAccountCompany.id,
          email: existAccountCompany.email,
          companyName: existAccountCompany.companyName,
        };

        res.json({
          code: "success",
          message: "Thành công!",
          infoUser: infoCompany,
        })
        return;
      }
    }

    // nếu lỗi
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({
      code: "success",
      message: "Đã đăng xuất"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đăng xuất không thành công!"
    })
  }
}