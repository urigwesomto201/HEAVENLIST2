const Inspection = require('../models/inspection');
const Transaction = require('../models/transaction');
const Tenant = require('../models/tenant');
const Landlord = require('../models/landlord');
const Listing = require('../models/listing');
// const sendEmail = require('../utils/sendMail');

exports.scheduleInspection = async (req, res) => {
  try {
    const {  scheduledDate, timeRange } = req.body;
    const {tenantId, listingId} = req.params
    if ( !scheduledDate || !timeRange) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = await Transaction.findOne({
      where: {
        tenantId,
        listingId,
        status: 'success'
      }
    });

    if (!transaction) {
      return res.status(403).json({
        message: 'You must complete payment before scheduling an inspection'
      });
    }

    const inspection = await Inspection.create({
      tenantId,
      listingId,
      scheduledDate,
      timeRange,
      status: 'scheduled'
    });

    const tenant = await Tenant.findOne({ where: { id: tenantId } });
    if(!tenant){
       return res.status(404).json({message:'Tenant not found '})
    }
    const listing = await Listing.findOne({ where: { id: listingId } });
    if(!listing){
        return res.satus(404).json({message:'listing  not found'})
    }
    const landlord = await Landlord.findOne({ where: { id: listing.landlordId } });
if(!landlord){
    res.satus(404).json({message:'landlord not found'})
}
    await sendEmail({
      to: landlord.email,
      subject: 'New Inspection Scheduled',
      text: `
        Hello ${landlord.fullName},

        A tenant (${tenant.fullName}) has scheduled an inspection for your property: ${listing.title}.
        
        Date: ${scheduledDate}
        Time Range: ${timeRange}

        Please follow up and confirm the appointment.

        Thank you!
      `
    });

    res.status(201).json({
      message: 'Inspection scheduled. Awaiting landlord confirmation.',
      data: inspection
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};