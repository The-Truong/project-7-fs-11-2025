import { Request, Response } from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";

export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const record = await Job.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "Không tìm thấy công việc!"
      })
      return;
    }

    const companyInfo = await AccountCompany.findOne({
      _id: record.companyId
    });


    if(!companyInfo) {
      res.json({
        code: "error",
        message: "Không tìm thấy công ty!"
      })
      return;
    }

    const jobDetail = {
      id: record.id,
      title: record.title,
      companyName: companyInfo.companyName,
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      images: record.images,
      position: record.position,
      workingForm: record.workingForm,
      companyAddress: companyInfo.address,
      technologies: record.technologys,
      description: record.description,
      companyId: record.companyId,
      companyLogo: companyInfo.logo,
      companyModel: companyInfo.companyModel,
      companyEmployees: companyInfo.companyEmployees,
      companyWorkingTime: companyInfo.workingTime,
      companyWorkingOverTime: companyInfo.workOverTime,
    }
    res.json({
      code: "success",
      message: "Thành công",
      jobDetail: jobDetail
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Thất bại!"
    })
  }
}