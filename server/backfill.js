import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Membership from './models/Membership.js';

dotenv.config();
connectDB();

const backfillMemberships = async () => {
  try {
    const users = await User.find();
    console.log(`Found ${users.length} users. Backfilling memberships...`);
    
    let count = 0;
    for (const user of users) {
      const existing = await Membership.findOne({ user_id: user._id });
      if (!existing) {
        // Defaults: artist demo usually gets Studio, others basic
        const plan = user.email === 'artist@artishub.com' ? 'studio' : 'basic';
        await Membership.create({
          user_id: user._id,
          plan,
          isActive: true,
          startDate: new Date()
        });
        count++;
      }
    }
    
    console.log(`Successfully created ${count} missing membership records.`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

backfillMemberships();
