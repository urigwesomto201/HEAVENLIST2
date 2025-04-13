const Inspection = require('../models/inspection');
const transactionModel = require('../models/transaction');
const tenantModel = require('../models/tenant')
const landlordModel = require('../models/landlord')
const listingModel = require('../models/listing');
const { DATEONLY } = require('sequelize');
const sendEmail = require('../middlewares/nodemailer')
const nodemailer = require('nodemailer');

const { Op } = require('sequelize');

exports.scheduleInspection = async (req, res) => {
  try {
    const { tenantId, listingId } = req.params;

    const { timeRange, days } = req.query;


    if (!timeRange || !days) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!validDays.includes(days)) {
      return res.status(400).json({ message: 'Invalid day. Please select a day from Monday to Saturday.' });
    }

   
    const getNextDateForDay = (day) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const todayIndex = today.getDay();
      const targetIndex = daysOfWeek.indexOf(day);

      const daysUntilTarget = (targetIndex - todayIndex + 7) % 7 || 7;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilTarget);
      return nextDate.toISOString().split('T')[0];
    };

    const scheduledDate = getNextDateForDay(days);

 
    const transaction = await transactionModel.findOne({
      where: {
        tenantId,
        listingId,
        status: 'success',
      },
    });

    if (!transaction) {
      return res.status(403).json({
        message: 'You must complete payment before scheduling an inspection',
      });
    }

 
    const listing = await listingModel.findOne({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const landlordId = listing.landlordId;

 
    const tenant = await tenantModel.findOne({ where: { id: tenantId } });
    if (!tenant || !tenant.email) {
      return res.status(400).json({ message: 'Tenant email is not defined or tenant not found' });
    }

 
    const landlord = await landlordModel.findOne({
      where: { id: landlordId },
      attributes: ['id', 'fullName', 'email'],
    });

    if (!landlord || !landlord.email) {
      return res.status(400).json({ message: 'Landlord email is not defined or landlord not found' });
    }


    const inspection = await Inspection.create({
      tenantId,
      listingId,
      scheduledDate,
      timeRange,
      days,
      status: 'scheduled',
      landlordId,
    });

    // Send email to the landlord
        const landlordMailDetails = {
          subject: 'Your Property Has Been Rented!',
          email: landlord.email,
          html: 
          `
            <p>Dear ${landlord.fullName || 'Landlord'},</p>
            <p>A tenant (${tenant.fullName}) has scheduled an inspection for your property: ${listing.title}.</p>
            Date: ${scheduledDate}
            Time Range: ${timeRange}
            <p>Thank you for using our service!</p>
            <p>Best Regards Team HavenList</p>
          `,
        }
        await sendEmail(landlordMailDetails);

        const tenantMailDetails = {
          subject: 'Inspection Status Updated',
          email: tenant.email,
          html: `
            <p>Hello ${tenant.fullName},</p>
            <p>Your inspection for the property "${listing.title}" has been scheduled successfully.</p>
            <p>Date: ${scheduledDate}</p>
            <p>Time Range: ${timeRange}</p>
            <p>The landlord (${landlord.fullName}) will follow up with you to confirm the appointment.</p>
            <p>Thank you for using our service!</p>
            <p>Best Regards Team HavenList</p>
          `,
        };
        await sendEmail(tenantMailDetails);

    // Respond with success
    res.status(201).json({
      message: 'Inspection scheduled. Awaiting confirmation.',
      data: inspection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};




exports.confirmSchedule = async (req, res) => {
  try {
    const { inspectionId } = req.params;
    const { status } = req.query;


    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }


    const inspection = await Inspection.findOne({ where: { id: inspectionId } });
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }


    const tenant = await tenantModel.findOne({ where: { id: inspection.tenantId } });
    if (!tenant || !tenant.email) {
      return res.status(400).json({ message: 'Tenant email is not defined or tenant not found' });
    }


    const listing = await listingModel.findOne({ where: { id: inspection.listingId } });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }


    const landlord = await landlordModel.findOne({
      where: { id: listing.landlordId },
      attributes: ['id', 'fullName', 'email'],
    });
    if (!landlord || !landlord.email) {
      return res.status(400).json({ message: 'Landlord email is not defined or landlord not found' });
    }


    inspection.status = status;
    await inspection.save();


    const tenantMailDetails = {
      subject: 'Inspection Status Updated',
      email: tenant.email,
      html: `
        <p>Hello ${tenant.fullName},</p>
        <p>Your inspection for the property "${listing.title}" has been updated successfully.</p>
        <p>Status: ${status}</p>
        <p>Thank you for using our service!</p>
        <p>Best Regards Team HavenList</p>
      `,
    };
    await sendEmail(tenantMailDetails);

    res.status(200).json({
      message: 'Inspection status updated successfully',
      data: inspection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Cannot confirm schedule date', error: error.message });
  }
};