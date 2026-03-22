import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Artwork from './models/Artwork.js';
import Membership from './models/Membership.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Artwork.deleteMany();
    await User.deleteMany();

    // Create an Admin and an Artist
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@artishub.com',
      password: 'password123',
      role: 'admin'
    });

    const artistUser = await User.create({
      name: 'Ravi Verma (Demo)',
      email: 'artist@artishub.com',
      password: 'password123',
      role: 'artist',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
    });

    await Membership.create([
      { user_id: adminUser._id, plan: 'basic', isActive: true, startDate: new Date() },
      { user_id: artistUser._id, plan: 'studio', isActive: true, startDate: new Date() }
    ]);

    const artworks = [
      {
        title: 'Divine Radha Krishna', price: 4500, category: 'Pichwai',
        imageUrl: 'https://images.unsplash.com/photo-1599059021750-82716ae2b661?q=80&w=600&auto=format&fit=crop',
        description: 'A beautiful Pichwai painting depicting the divine love.',
        artist: artistUser._id
      },
      {
        title: 'Royal Procession', price: 3200, category: 'Mughal Miniature',
        imageUrl: 'https://images.unsplash.com/photo-1588612733979-994c502da8c8?q=80&w=600&auto=format&fit=crop',
        description: 'Detailed miniature art showing a royal procession.',
        artist: artistUser._id
      },
      {
         title: 'Village Life', price: 1500, category: 'Warli',
         imageUrl: 'https://images.unsplash.com/photo-1629864274971-ce4826de391f?q=80&w=600&auto=format&fit=crop',
         description: 'Traditional Warli art depicting everyday village activities.',
         artist: artistUser._id
      },
      {
         title: 'Peacock Delight', price: 3200, category: 'Madhubani',
         imageUrl: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cb7?q=80&w=600&auto=format&fit=crop',
         description: 'Vibrant Madhubani painting of a peacock.',
         artist: artistUser._id
      }
    ];

    await Artwork.insertMany(artworks);
    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
