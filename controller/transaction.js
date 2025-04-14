const { Op, fn, col } = require('sequelize');
const transactionModel = require('../models/transaction');
const tenantModel = require('../models/tenant');
const landlordModel = require('../models/landlord');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { tenentRentMessage, landlordRentMessage } = require('../utils/mailTemplates');
const sendEmail = require('../middlewares/nodemailer');


const otp = otpGenerator.generate(12, { specialChars: false });
const ref = `TCA-AF${otp}`;
const secret_key = process.env.koraPay_SECRET_KEY;
const formatDate = new Date().toLocaleString();


exports.initialPayment = async (req, res) => {
  try {
    const { amount, email, name } = req.body;
    const { tenantId, landlordId, listingId } = req.params;

    if (!tenantId || !landlordId || !listingId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!amount || !email || !name) {
      return res.status(400).json({ message: 'PLEASE INPUT ALL FIELDS' });
    }


    const paymentData = {
      amount,
      customer: { name, email },
      currency: 'NGN',
      reference: ref,

    };


    const response = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${secret_key}`,
        },
      }
    );

    const { data } = response?.data;

  
    await transactionModel.create({
      email,
      amount,
      name,
      reference: data?.reference,
      paymentDate: formatDate,
      status: 'pending',
      landlordId,
      tenantId,
      listingId
      

    });

  
    res.status(201).json({
      message: 'Payment initialized successfully',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url,
      },
    });
  } catch (error) {
    if (error.response?.status === 409) {
      return res.status(409).json({ message: 'Transaction already exists or duplicate reference' });
    }

    res.status(500).json({ message: 'Error initializing payment', error: error.message });
  }
};





exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;


    if (!reference) {
      return res.status(400).json({ message: 'Reference is required' });
    }


    const existingTransaction = await transactionModel.findOne({ where: { reference } });

    if (!existingTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }


    if (existingTransaction.status === 'success') {
      return res.status(400).json({ message: 'Payment has already been verified successfully' });
    }

    if (existingTransaction.status === 'failed') {
      return res.status(400).json({ message: 'Payment verification already failed' });
    }


    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secret_key}`,
        },
      }
    );

    const data = response?.data;

 
    if (data?.data?.status === 'success') {
      console.log('Payment successful');

  
      await transactionModel.update(
        { status: 'success' },
        { where: { reference } }
      );

      // Fetch tenant and landlord details
      const tenant = await tenantModel.findOne({ where: { id: existingTransaction.tenantId } });
      const landlord = await landlordModel.findOne({ where: { id: existingTransaction.landlordId } });

      const tenantname = tenant.fullName
      const tenentamount = existingTransaction.amount
      
      const tenanthtml = tenentRentMessage(tenentamount, tenantname)

     
      if (tenant?.email) {
        const tenantMailDetails = {
          subject: 'Payment Successful - Property Rented!',
          email: tenant.email,
          html: tenanthtml
          // `
          //   <p>Dear ${tenant.fullName || 'Tenant'},</p>
          //   <p>Your payment of NGN ${existingTransaction.amount} was successful. You have successfully rented the property.</p>
          //   <p>Thank you for using our service!</p>
          // `,
        };
        await sendEmail(tenantMailDetails);
      }

      const firstName = landlord.fullName
      const landlordamount = existingTransaction.amount
      
      const landlordhtml = landlordRentMessage(landlordamount, firstName)

      // Send email to the landlord
      if (landlord?.email) {
        const landlordMailDetails = {
          subject: 'Your Property Has Been Rented!',
          email: landlord.email,
          html: landlordhtml

          // `
          //   <p>Dear ${landlord.fullName || 'Landlord'},</p>
          //   <p>Your property has been successfully rented. A payment of NGN ${existingTransaction.amount} has been made by the tenant.</p>
          //   <p>Thank you for using our service!</p>
          // `,
        }
        await sendEmail(landlordMailDetails);
      }

      // Respond with success
      res.status(200).json({
        message: 'Payment verification successful',
        reference,
      });
    } else {
      console.log('Payment failed');

      // Update the transaction status to 'failed'
      await transactionModel.update(
        { status: 'failed' },
        { where: { reference } }
      );

      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};








