import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import routes from './routes/index.route';
import { connectDB } from './configs/database.config';

const app = express()
const port = 4000

//kết nối db
connectDB();

//cấu hình cors
app.use(cors({
  origin: '*', //đường dẫn frontend của bạn
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// cho phép gửi data lên ở dạng json, chuyển dữ liệu từ json sang js
app.use(express.json());

//thiết lập đường dẫn
app.use('/', routes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`)
})