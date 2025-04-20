const { Op, fn, col } = require('sequelize');
const transactionModel = require('../models/transaction');
const tenantModel = require('../models/tenant');
const landlordModel = require('../models/landlord');
const listingModel = require('../models/listing'); //
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

    // Fetch the listing details
    const listing = await listingModel.findOne({
      where: { id: listingId },
      attributes: ['id', 'price', 'partPayment', 'partPaymentAmount', 'landlordId', 'status', 'isAvailable'],
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Validate that the listing is accepted and available
    if (listing.status !== 'accepted') {
      return res.status(400).json({ message: 'This property is not accepted for payment.' });
    }

    if (!listing.isAvailable) {
      return res.status(400).json({ message: 'This property is no longer available for payment.' });
    }

    

    // Calculate the expected part-payment amount
    const partPaymentPercentage = parseFloat(listing.partPayment.replace('%', '')) / 100; // Remove '%' and convert to decimal
    const expectedPartPaymentAmount = listing.price * partPaymentPercentage;

    // Validate the payment amount (must be above or equal to the part-payment amount and not exceed the listing price)
    if (parseFloat(amount) < expectedPartPaymentAmount) {
      return res.status(400).json({
        message: `Invalid payment amount. You must pay at least the part-payment amount of ₦${expectedPartPaymentAmount}.`,
      });
    }

    if (parseFloat(amount) > listing.price) {
      return res.status(400).json({
        message: `Invalid payment amount. You cannot pay more than the listing price of ₦${listing.price}.`,
      });
    }

    // Check if tenant exists
    const tenant = await tenantModel.findOne({
      where: { id: tenantId },
      attributes: ['id', 'fullName'],
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const paymentData = {
      amount,
      customer: { name, email },
      currency: 'NGN',
      reference: ref,
      redirect_url: "https://haven-list.vercel.app/api/v1/payment/status",
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
      amount, // Save the actual amount paid by the tenant
      name,
      partPaymentAmount: expectedPartPaymentAmount, // Save the calculated part-payment amount
      balance: listing.price - amount, // Update balance after the payment
      reference: data?.reference,
      paymentDate: formatDate,
      status: 'pending',
      landlordId,
      tenantId,
      listingId,
    });

    await listing.update({
      balance: listing.price - amount, // Update the listing's balance
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

    // Fetch the transaction using the reference
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

    // Verify the payment status from the payment gateway
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

      // Update the transaction status to 'success'
      await transactionModel.update(
        { status: 'success' },
        { where: { reference } }
      );

      // Fetch tenant, landlord, and listing details
      const tenant = await tenantModel.findOne({ where: { id: existingTransaction.tenantId } });
      const landlord = await landlordModel.findOne({ where: { id: existingTransaction.landlordId } });
      const listing = await listingModel.findOne({ where: { id: existingTransaction.listingId } });

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found.' });
      }

      // Ensure balance is a valid number
      const currentBalance = listing.balance || listing.price; // Use price if balance is null
      const newBalance = currentBalance - existingTransaction.amount;

      // Update the listing's balance and mark it as unavailable if fully paid
      const isFullyPaid = newBalance <= 0;
      await listing.update({
        balance: newBalance,
        isAvailable: !isFullyPaid, // Mark the property as unavailable if fully paid
      });

      // Send email to the tenant
      if (tenant?.email) {
        const tenantMailDetails = {
          subject: 'Payment Successful - Property Rented!',
          email: tenant.email,
          html: tenentRentMessage(existingTransaction.amount, newBalance, tenant.fullName),
        };
        await sendEmail(tenantMailDetails);
      }

      // Send email to the landlord
      if (landlord?.email) {
        const landlordMailDetails = {
          subject: 'Your Property Has Been Rented!',
          email: landlord.email,
          html: landlordRentMessage(existingTransaction.amount, newBalance, landlord.fullName),
        };
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
}


exports.payBalance = async (req, res) => {
  try {
    const { amount, email, name } = req.body;
    const { tenantId, landlordId, listingId } = req.params;

    if (!tenantId || !landlordId || !listingId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!amount || !email || !name) {
      return res.status(400).json({ message: 'PLEASE INPUT ALL FIELDS' });
    }

    // Fetch the listing details
    const listing = await listingModel.findOne({
      where: { id: listingId },
      attributes: ['id', 'price', 'balance', 'landlordId', 'tenantId', 'status', 'isAvailable'],
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Validate that the listing is accepted and available
    if (listing.status !== 'accepted') {
      return res.status(400).json({ message: 'This property is not accepted for payment.' });
    }

    if (!listing.isAvailable) {
      return res.status(400).json({ message: 'This property is no longer available for payment.' });
    }

    // Ensure the tenant making the payment is the same tenant associated with the listing
    if (listing.tenantId !== tenantId) {
      return res.status(403).json({ message: 'You are not authorized to pay the balance for this listing.' });
    }

    // Ensure balance is a valid number
    const currentBalance = listing.balance || listing.price; // Use price if balance is null

    // Validate the payment amount
    if (parseFloat(amount) > currentBalance) {
      return res.status(400).json({
        message: `Invalid payment amount. You cannot pay more than the remaining balance of ₦${currentBalance}.`,
      });
    }

    // Process the payment
    const paymentData = {
      amount,
      customer: { name, email },
      currency: 'NGN',
      reference: ref,
      redirect_url: "https://haven-list.vercel.app/api/v1/payment/status",
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

    // Create a new transaction for the balance payment
    await transactionModel.create({
      email,
      amount,
      name,
      balance: currentBalance - amount, // Update balance after the payment
      reference: data?.reference,
      paymentDate: formatDate,
      status: 'pending',
      landlordId,
      tenantId,
      listingId,
    });

    // Update the listing's balance
    const newBalance = currentBalance - amount;
    const isFullyPaid = newBalance <= 0;
    await listing.update({
      balance: newBalance,
      isAvailable: !isFullyPaid, // Mark the property as unavailable if fully paid
    });

    res.status(201).json({
      message: 'Balance payment initialized successfully',
      data: {
        reference: data?.reference,
        checkout_url: data?.checkout_url,
      },
    });
  } catch (error) {
    if (error.response?.status === 409) {
      return res.status(409).json({ message: 'Transaction already exists or duplicate reference' });
    }

    res.status(500).json({ message: 'Error initializing balance payment', error: error.message });
  }
};