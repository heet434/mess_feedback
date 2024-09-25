const Response = require("../models/response");

const createNew = async (req, res) => {
  const userCheck = Response.findById({ outlookEmail: req.body.outlookEmail });
  if (userCheck.filledEarlier) {
    res.json("Already filled of this month!");
  }
  await Response.create({
    name: req.body.name,
    outlookEmail: req.body.outlookEmail,
    rollNo: req.body.rollNo,
    gender: req.body.gender,
    hostel: req.body.hostel,
    phoneNumber: req.body.phoneNumber,
    opiRating: req.body.opiRating,
    opiComments: req.body.opiComments,
    subscribedMess: req.body.subscribedMess,
    month: req.body.month,
    filledEarlier: true,
  });
};
export const opiController = { 
    createNew : createNew
 };
