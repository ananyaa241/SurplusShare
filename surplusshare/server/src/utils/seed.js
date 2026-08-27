import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import Reservation from '../models/Reservation.js';

const SEED_DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surplusshare';

export const seedDB = async (isStandalone = true) => {
    try {
        if (isStandalone) {
            await mongoose.connect(SEED_DB_URI);
            console.log('Connected to DB...');
        }

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await FoodListing.deleteMany({});
        await Reservation.deleteMany({});

        console.log('Seeding Demo Users...');
        const hashedPass = await bcrypt.hash('password123', 10);

        // SUPPLIERS
        const greenBowl = await User.create({ name: 'Green Bowl Restaurant', email: 'demo.supplier@surplusshare.com', password: hashedPass, role: 'supplier', profileImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=150&auto=format&fit=crop' });
        const sunriseBakery = await User.create({ name: 'Sunrise Bakery', email: 'sunrise@demo.com', password: hashedPass, role: 'supplier', profileImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150&auto=format&fit=crop' });
        const freshHarvest = await User.create({ name: 'Fresh Harvest Grocery', email: 'fresh@demo.com', password: hashedPass, role: 'supplier' });

        // RECEIVERS
        const arjun = await User.create({ name: 'Arjun', email: 'demo.receiver@surplusshare.com', password: hashedPass, role: 'receiver', mealsRescued: 42, profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' });
        const priya = await User.create({ name: 'Priya', email: 'priya@demo.com', password: hashedPass, role: 'receiver', mealsRescued: 18 });

        // ADMIN
        await User.create({ name: 'Admin', email: 'demo.admin@surplusshare.com', password: hashedPass, role: 'admin' });

        console.log('Seeding Food Listings...');
        const now = new Date();
        const addHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);
        const subHours = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000);

        const listings = await FoodListing.insertMany([
            {
                supplier: greenBowl._id,
                foodName: 'Vegetable Biryani',
                description: 'Surplus from our lunch buffet. Perfectly fresh and delicious!',
                image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop',
                quantity: 20,
                availableQuantity: 15,
                unit: 'meals',
                foodType: 'Vegetarian',
                dietaryInformation: ['No Dairy', 'Nut-Free'],
                pickupStart: now,
                pickupEnd: addHours(3),
                expiryTime: addHours(4),
                location: 'Koramangala, Bengaluru',
                coordinates: { lat: 12.9352, lng: 77.6245 },
                status: 'AVAILABLE'
            },
            {
                supplier: sunriseBakery._id,
                foodName: 'Fresh Bread Basket',
                description: 'Assorted artisan breads baked this morning. Sourdough and baguettes.',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
                quantity: 10,
                availableQuantity: 0,
                unit: 'baskets',
                foodType: 'Vegetarian',
                dietaryInformation: [],
                pickupStart: subHours(1),
                pickupEnd: addHours(1),
                expiryTime: addHours(2),
                location: 'Indiranagar, Bengaluru',
                coordinates: { lat: 12.9716, lng: 77.6411 },
                status: 'COLLECTED'
            },
            {
                supplier: freshHarvest._id,
                foodName: 'Mixed Fruit Basket',
                description: 'Slightly bruised but perfectly edible apples, bananas, and oranges.',
                image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600&auto=format&fit=crop',
                quantity: 5,
                availableQuantity: 5,
                unit: 'kg',
                foodType: 'Vegan',
                dietaryInformation: ['Gluten-Free', 'Organic'],
                pickupStart: now,
                pickupEnd: addHours(5),
                expiryTime: addHours(24),
                location: 'Jayanagar, Bengaluru',
                coordinates: { lat: 12.9279, lng: 77.5871 },
                status: 'AVAILABLE'
            },
            {
                supplier: greenBowl._id,
                foodName: 'Dal Tadka & Rice',
                description: 'Classic comfort food. Prepared fresh this afternoon.',
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
                quantity: 15,
                availableQuantity: 5,
                unit: 'meals',
                foodType: 'Vegetarian',
                dietaryInformation: ['Gluten-Free'],
                pickupStart: addHours(1),
                pickupEnd: addHours(3),
                expiryTime: addHours(4),
                location: 'Koramangala, Bengaluru',
                coordinates: { lat: 12.9360, lng: 77.6250 },
                status: 'AVAILABLE'
            },
            {
                supplier: sunriseBakery._id,
                foodName: 'Assorted Muffins',
                description: 'Blueberry, chocolate chip, and banana nut muffins.',
                image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600&auto=format&fit=crop',
                quantity: 24,
                availableQuantity: 24,
                unit: 'items',
                foodType: 'Vegetarian',
                dietaryInformation: ['Contains Nuts', 'Contains Eggs'],
                pickupStart: now,
                pickupEnd: addHours(2),
                expiryTime: addHours(5),
                location: 'Indiranagar, Bengaluru',
                coordinates: { lat: 12.9720, lng: 77.6400 },
                status: 'AVAILABLE'
            },
            {
                supplier: greenBowl._id,
                foodName: 'Paneer Curry',
                description: 'Rich paneer butter masala from yesterday\'s catering.',
                image: null, // Test fallback image
                quantity: 10,
                availableQuantity: 0,
                unit: 'portions',
                foodType: 'Vegetarian',
                dietaryInformation: ['Contains Dairy'],
                pickupStart: subHours(10),
                pickupEnd: subHours(8),
                expiryTime: subHours(5),
                location: 'Koramangala, Bengaluru',
                coordinates: { lat: 12.9352, lng: 77.6245 },
                status: 'EXPIRED'
            },
            {
                supplier: freshHarvest._id,
                foodName: 'Seasonal Vegetables Box',
                description: 'Tomatoes, onions, and potatoes. Perfect for home cooking.',
                image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=600&auto=format&fit=crop',
                quantity: 8,
                availableQuantity: 8,
                unit: 'boxes',
                foodType: 'Vegan',
                dietaryInformation: ['Organic'],
                pickupStart: now,
                pickupEnd: addHours(8),
                expiryTime: addHours(48),
                location: 'Jayanagar, Bengaluru',
                coordinates: { lat: 12.9279, lng: 77.5871 },
                status: 'AVAILABLE'
            }
        ]);

        console.log('Seeding Reservations...');
        // Create some reservations to show off the UI
        await Reservation.insertMany([
            {
                foodListing: listings[0]._id, // Vegetable Biryani
                receiver: arjun._id,
                quantity: 5,
                pickupCode: '482731',
                status: 'RESERVED',
                reservedAt: subHours(1)
            },
            {
                foodListing: listings[1]._id, // Fresh Bread
                receiver: arjun._id,
                quantity: 10, // Full amount
                pickupCode: '192837',
                status: 'COLLECTED',
                reservedAt: subHours(5),
                collectedAt: subHours(2)
            },
            {
                foodListing: listings[3]._id, // Dal Tadka
                receiver: priya._id,
                quantity: 10,
                pickupCode: '556677',
                status: 'RESERVED',
                reservedAt: subHours(0.5)
            }
        ]);

        console.log('Seeding Complete! Demo accounts ready.');
        console.log('Supplier: demo.supplier@surplusshare.com / password123');
        console.log('Receiver: demo.receiver@surplusshare.com / password123');
        console.log('Supplier: demo.supplier@surplusshare.com / password123');
        console.log('Receiver: demo.receiver@surplusshare.com / password123');

        if (isStandalone) process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        if (isStandalone) process.exit(1);
        throw err;
    }
};

// Only run standalone if executed directly via node
const isMain = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isMain) {
    seedDB(true);
}
