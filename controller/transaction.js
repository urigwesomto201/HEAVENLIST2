const transactionModel = require('../models/transaction');
const tenant = require('../models/tenant')
const landlord = require('../models/landlord')
const axios = require("axios");
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer')
// Generate OTP and reference
const otp = otpGenerator.generate(12, { specialChars: false });
const ref = `TCA-AF${otp}`;  // Use backticks for template literal
const secret_key = process.env.koraPay_SECRET_KEY;
const formatDate = new Date().toLocaleString();

// Initial Payment Controller
exports.initialPayment = async (req, res) => {
  try {
    const { amount, email, name } = req.body;
    const {tenantId,landlordId} = req.params;
    // Validate input fields
    if (!amount || !email || !name) {
      return res.status(400).json({ message: 'PLEASE INPUT ALL FIELDS' });
    }

    // Payment data to send to Korapay
    const paymentData = {
      amount,
      customer: { name, email },
      currency: 'NGN',
      reference: ref,
  
    };

    // Send request to Korapay API
    const response = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${secret_key}`  // Fix: Use backticks for the Authorization header
        }
      }
    );

    const { data } = response?.data;

    // Save transaction in the database
    const payment = await transactionModel.create({
      email,
      amount,
      name,
      reference: paymentData.reference,
      paymentDate: formatDate,
      landlordId,
      tenantId

    });

    // Return response to client
    res.status(201).json({
      message: "Payment initialized successfully",
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url
      }
    });
  } catch (error) {
    if (error.response?.status === 409) {
        return res.status(409).json({ message: 'Transaction already exists or duplicate reference' });
      }

    res.status(500).json({ message: "Error initializing payment",  }+ error.message);
  }
};

exports.verifyPayment = async (req, res) => {
    try {
      const { reference } = req.query;
      const existingTransaction = await transactionModel.findOne({ where: { reference } });

      if (!existingTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Check if the status is already 'success' or 'failed'
      if (existingTransaction.status === 'success') {
        return res.status(400).json({ message: 'Payment has already been verified successfully' });
      }
      
      if (existingTransaction.status === 'failed') {
        return res.status(400).json({ message: 'Payment verification already failed' });
      }
      // Send request to Korapay API to verify payment
      const response = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secret_key}`  // Ensure correct token usage
          }
        }
      );
  
      const { data } = response;
  
      if (data.data.status && data.data.status === 'success') {
        console.log('Payment successful');
  
        
        await transactionModel.update(
          { status: 'success' },
          { where: { reference } }
        );
     const tenantEmail = await tenant.findOne({where:{id:existingTransaction.tenantId}})
     const landlordEmail = await landlord.findOne({where:{id:existingTransaction.landlordId}})
    if(tenantEmail?.email){
      const mailDetails = {
                  subject: 'Payment successfully - You have Rented a property!',
                  email: tenant.email,
                  html
                  
              }
              await sendEmail(mailDetails)
    }
    if (landlordEmail?.email){
      const mailDetails = {
        subject: 'Your property Has Been Rented!',
        email: landlord.email,
        html
        
    }
    await sendEmail(mailDetails)
    }
    
        res.status(200).json({
          message: 'Payment verification successful',
          reference,
        });
      } else {
        console.log('Payment failed');
  
        await transactionModel.update(
          { status: 'failed' },
          { where: { reference } }
        );
  
        res.status(400).json({ message: 'Payment failed' });
      }
    } catch (error) {
      
      res.status(500).json({ message: "Error verifying payment",  }+error.message);
    }
  };
  




  const { Op, fn, col } = require('sequelize');


exports.getLandlordTransactions = async (req, res) => {
  try {
    const { landlordId } = req.params;

    
    const transactions = await transactionModel.findAll({
      where: {
        landlordId,
        status: 'success'
      },
      order: [['paymentDate', 'DESC']]
    });

    
    const totalResult = await transactionModel.findOne({
      where: {
        landlordId,
        status: 'success'
      },
      attributes: [
        [fn('SUM', col('amount')), 'totalAmount']
      ],
      raw: true
    });

    const totalAmount = parseFloat(totalResult.totalAmount) || 0;

    
    await landlord.update(
      { transactionHistory: totalAmount },
      { where: { id: landlordId } }
    );

  
    res.status(200).json({
      message: 'Landlord transaction history retrieved successfully',
      totalAmount,
      transactions
    });

  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching landlord transactions', error: error.message });
  }
};