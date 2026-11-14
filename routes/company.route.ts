import { Router } from "express";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";
import { verifyTokenCompany } from "../middlewares/auth.middleware";
import * as companyController from '../controllers/company.controller';
import * as companyValidate from '../validates/company.validate';

const router = Router();

const upload = multer({ storage: storage });

router.post('/register',
    companyValidate.registerPost,
    companyController.registerPost);

router.post('/login',
    companyValidate.loginPost,
    companyController.loginPost);

router.patch('/profile',
    verifyTokenCompany,
    upload.single("logo"),
    companyValidate.profilePath,
    companyController.profilePatch);

router.post('/job/create',
    verifyTokenCompany,
    upload.array('images', 3),
    companyValidate.createJobPost,
    companyController.createJobPost);
    
export default router;