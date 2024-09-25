const Response = require("../models/response");
const nodemailer = require("nodemailer"); 
const mongoose = require("mongoose");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '**', // replace with your email
    pass: '**', // replace with your password
  },
});


const allOpi = async (req, res) => {
  try {

    const today = new Date();


    const startOfMonthIST = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonthIST.setUTCHours(0, 0, 0, 0); 
    
  
    const endOfDayIST = new Date(today.setUTCHours(23, 59, 59, 999));


    const opiRes = await Response.find({
      timestamp: {
        $gte: startOfMonthIST,
        $lte: endOfDayIST,
      },
    });


    res.status(200).json(opiRes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching current month's data", error });
  }
};


const archiveAndSendEmail = async () => {
  try {

    const today = new Date();

 
    if (today.getDate() === 1) {

      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); 

      const lastMonthData = await Response.find({
        timestamp: {
          $gte: lastMonth,
          $lte: endOfLastMonth,
        },
      });

      const emailContent = JSON.stringify(lastMonthData);


      const mailOptions = {
        from: '**',
        to: ['**', '**', '**', '**'], 
        subject: `Data for ${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`,
        text: `Here is the data for the month of ${lastMonth.toLocaleString('default', { month: 'long' })}:\n\n${emailContent}`,
      };


      await transporter.sendMail(mailOptions);
      console.log("Last month's data sent to emails");

     
      await Response.deleteMany({
        timestamp: {
          $gte: lastMonth,
          $lte: endOfLastMonth,
        },
      });
      console.log("Last month's data deleted from database");
    }
  } catch (error) {
    console.error("Error sending last month's data:", error);
  }
};


const scheduleDailyCheck = () => {
  const cron = require("node-cron");


  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily check for month-end data archival...");
    await archiveAndSendEmail();
  });
};

// Start the scheduler
scheduleDailyCheck();

export const adminController = {
  allOpi,
};

