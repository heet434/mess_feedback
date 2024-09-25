import express from "express";
import http from "http";
import mongoose from "mongoose";
import { opiController }from "./controller/opiController";
import { verifyUserInfo } from "./middlewares/userInfo";
import { adminController } from "./controller/adminController";
mongoose.set("strictQuery", false);
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3601;

app.use("*",(req,res) => {
  throw new NotFoundError("Route not found");
});

app.post('/new' , verifyUserInfo , opiController.createNew );
app.get('/admin/all' , verifyUserInfo , adminController.allOpi);



server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
