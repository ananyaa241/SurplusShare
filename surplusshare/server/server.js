import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import listingRoutes from './src/routes/listingRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';
import { seedDB } from './src/utils/seed.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surplusshare';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const User = (await import('./src/models/User.js')).default;
            const count = await User.countDocuments();
            if (count === 0) {
                console.log('⚠️ Database is completely empty! Auto-seeding demonstration data exclusively for viewers...');
                await seedDB(false);
                console.log('✅ Auto-seed complete!');
            }
        } catch (e) {
            console.error('Auto-seed initialization failed:', e);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
