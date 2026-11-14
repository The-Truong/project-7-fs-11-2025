import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../models/account-company.model";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/job.model";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountCompany.findOne({
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
  
    const newRecord = new AccountCompany(req.body);
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
      
    const existAccount = await AccountCompany.findOne({
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
        type: "company"
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '1d',
      }
    );
    
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true, //chỉ cho phép gửi bên server
      secure: process.env.NODE_ENV === "production", //(nếu là https để là true, nếu là http để là false bảo mật)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //cho phép gửi khác tên miền (nếu là https để là none, nếu là http để là lax)
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

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    req.body.logo = req.file ? req.file.path : '';
    
    await AccountCompany.updateOne({
      _id: req.account.id,
    }, req.body);

    res.json({
      code: "success",
      message: "Đã cập nhật",
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    })
  }
}

export const createJobPost = async (req: AccountRequest, res: Response) => {
  try {
    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologys = req.body.technologys ? req.body.technologys.split(', ') : [];
    req.body.images = req.files ? (req.files as Express.Multer.File[]).map((file) => file.path) : [];

    const newRecord = new Job(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Đã tạo công việc mới",
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    })
  }
}

export const jobList = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.account.id;

    const jobs = await Job.find({
      companyId: id
    })
    .sort({
      createdAt: "desc"
    });

    const dataFinal = [];

    for (const item of jobs) {
      dataFinal.push({
        id: item.id,
        title: item.title,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        technologies: item.technologys
      })
    }

    res.json({
      code: "success",
      message: "Lấy dữ liệu thành công",
      jobs: dataFinal
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Không lấy được dữ liệu!",
    })
  }
}