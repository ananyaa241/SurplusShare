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
        // IST offset (5.5 hours) explicitly calculated if needed, but relative offsets work universally
        const now = new Date();
        const addHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);
        const subHours = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000);

        const listings = await FoodListing.insertMany([
            { supplier: greenBowl._id, foodName: 'Vegetable Biryani', description: 'Surplus lunch buffet. Freshly packed!', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600', quantity: 20, availableQuantity: 15, unit: 'meals', foodType: 'Vegetarian', dietaryInformation: ['No Dairy'], pickupStart: now, pickupEnd: addHours(3), expiryTime: addHours(4), location: 'Koramangala, Bengaluru', coordinates: { lat: 12.9352, lng: 77.6245 }, status: 'AVAILABLE' },
            { supplier: sunriseBakery._id, foodName: 'Fresh Bread Basket', description: 'Assorted artisan breads.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600', quantity: 10, availableQuantity: 0, unit: 'baskets', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: subHours(1), pickupEnd: addHours(1), expiryTime: addHours(2), location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9716, lng: 77.6411 }, status: 'COLLECTED' },
            { supplier: freshHarvest._id, foodName: 'Mixed Fruit Basket', description: 'Perfectly edible apples and bananas.', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600', quantity: 5, availableQuantity: 5, unit: 'kg', foodType: 'Vegan', dietaryInformation: ['Organic'], pickupStart: now, pickupEnd: addHours(5), expiryTime: addHours(24), location: 'Jayanagar, Bengaluru', coordinates: { lat: 12.9279, lng: 77.5871 }, status: 'AVAILABLE' },
            { supplier: greenBowl._id, foodName: 'Dal Tadka & Rice', description: 'Classic comfort food.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600', quantity: 15, availableQuantity: 5, unit: 'meals', foodType: 'Vegetarian', dietaryInformation: ['Gluten-Free'], pickupStart: addHours(1), pickupEnd: addHours(3), expiryTime: addHours(4), location: 'Koramangala, Bengaluru', coordinates: { lat: 12.9360, lng: 77.6250 }, status: 'AVAILABLE' },
            { supplier: sunriseBakery._id, foodName: 'Assorted Muffins', description: 'Blueberry and chocolate chip muffins.', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600', quantity: 24, availableQuantity: 24, unit: 'items', foodType: 'Vegetarian', dietaryInformation: ['Contains Nuts'], pickupStart: now, pickupEnd: addHours(2), expiryTime: addHours(5), location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9720, lng: 77.6400 }, status: 'AVAILABLE' },
            { supplier: greenBowl._id, foodName: 'Paneer Curry', description: 'Rich paneer butter masala.', image: 'https://images.unsplash.com/photo-1589301773099-dc30bd47a7b9?q=80&w=600', quantity: 10, availableQuantity: 0, unit: 'portions', foodType: 'Vegetarian', dietaryInformation: ['Contains Dairy'], pickupStart: subHours(10), pickupEnd: subHours(8), expiryTime: subHours(5), location: 'Koramangala, Bengaluru', coordinates: { lat: 12.9352, lng: 77.6245 }, status: 'EXPIRED' },
            { supplier: freshHarvest._id, foodName: 'Seasonal Vegetables Box', description: 'Tomatoes, onions, potatoes.', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=600', quantity: 8, availableQuantity: 8, unit: 'boxes', foodType: 'Vegan', dietaryInformation: ['Organic'], pickupStart: now, pickupEnd: addHours(8), expiryTime: addHours(48), location: 'Jayanagar, Bengaluru', coordinates: { lat: 12.9279, lng: 77.5871 }, status: 'AVAILABLE' },

            // New 20 items:
            { supplier: sunriseBakery._id, foodName: 'Masala Dosa Batter', description: 'Freshly ground batter, good for 15 dosas.', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=600', quantity: 15, availableQuantity: 15, unit: 'liters', foodType: 'Vegan', dietaryInformation: ['Gluten-Free'], pickupStart: now, pickupEnd: addHours(6), expiryTime: addHours(12), location: 'Malleshwaram, Bengaluru', coordinates: { lat: 13.0012, lng: 77.5710 }, status: 'AVAILABLE' },
            { supplier: greenBowl._id, foodName: 'Idli & Sambar', description: 'Hot steamed idlis with spicy sambar.', image: 'https://images.unsplash.com/photo-1626779435860-f1db4281f621?q=80&w=600', quantity: 30, availableQuantity: 30, unit: 'plates', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: now, pickupEnd: addHours(2), expiryTime: addHours(4), location: 'BTM Layout, Bengaluru', coordinates: { lat: 12.9165, lng: 77.6101 }, status: 'AVAILABLE' },
            { supplier: freshHarvest._id, foodName: 'Gobi Manchurian', description: 'Leftover from corporate event.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600', quantity: 12, availableQuantity: 4, unit: 'boxes', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: now, pickupEnd: addHours(4), expiryTime: addHours(6), location: 'HSR Layout, Bengaluru', coordinates: { lat: 12.9121, lng: 77.6446 }, status: 'RESERVED' },
            { supplier: greenBowl._id, foodName: 'Roti & Palak Paneer', description: 'Healthy spinach gravy with wheat rotis.', image: 'https://images.unsplash.com/photo-1626778937989-18ba4d84f23b?q=80&w=600', quantity: 20, availableQuantity: 20, unit: 'meals', foodType: 'Vegetarian', dietaryInformation: ['Contains Dairy'], pickupStart: now, pickupEnd: addHours(4), expiryTime: addHours(6), location: 'Whitefield, Bengaluru', coordinates: { lat: 12.9698, lng: 77.7499 }, status: 'AVAILABLE' },
            { supplier: sunriseBakery._id, foodName: 'Filter Coffee Decoction', description: 'Freshly brewed aromatic coffee decoction.', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600', quantity: 5, availableQuantity: 5, unit: 'bottles', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: now, pickupEnd: addHours(12), expiryTime: addHours(48), location: 'Malleshwaram, Bengaluru', coordinates: { lat: 13.0033, lng: 77.5714 }, status: 'AVAILABLE' },
            { supplier: freshHarvest._id, foodName: 'Samosas', description: 'Crispy potato-filled pastries.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600', quantity: 50, availableQuantity: 0, unit: 'pieces', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: subHours(12), pickupEnd: subHours(10), expiryTime: subHours(2), location: 'Kammanahalli, Bengaluru', coordinates: { lat: 13.0150, lng: 77.6380 }, status: 'EXPIRED' },
            { supplier: greenBowl._id, foodName: 'Naan & Chana Masala', description: 'Garlic naan with chickpea curry.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600', quantity: 25, availableQuantity: 25, unit: 'meals', foodType: 'Vegan', dietaryInformation: [], pickupStart: now, pickupEnd: addHours(3), expiryTime: addHours(5), location: 'Electronic City, Bengaluru', coordinates: { lat: 12.8399, lng: 77.6770 }, status: 'AVAILABLE' },
            { supplier: sunriseBakery._id, foodName: 'Vada Pav', description: 'Spicy potato sliders.', image: 'https://images.unsplash.com/photo-1626778937989-18ba4d84f23b?q=80&w=600', quantity: 15, availableQuantity: 0, unit: 'pieces', foodType: 'Vegetarian', dietaryInformation: [], pickupStart: subHours(3), pickupEnd: subHours(1), expiryTime: addHours(1), location: 'Koramangala, Bengaluru', coordinates: { lat: 12.9340, lng: 77.6250 }, status: 'COLLECTED' },
            { supplier: freshHarvest._id, foodName: 'Pesarattu (Moong Dal Dosa)', description: 'Protein rich green gram crepes.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600', quantity: 10, availableQuantity: 10, unit: 'meals', foodType: 'Vegan', dietaryInformation: ['Gluten-Free'], pickupStart: now, pickupEnd: addHours(3), expiryTime: addHours(5), location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9780, lng: 77.6400 }, status: 'AVAILABLE' },
            { supplier: greenBowl._id, foodName: 'Veg Pulao', description: 'Fragrant basmati rice with mixed vegetables.', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600', quantity: 40, availableQuantity: 40, unit: 'meals', foodType: 'Vegetarian', dietaryInformation: ['Gluten-Free'], pickupStart: now, pickupEnd: addHours(4), expiryTime: addHours(6), location: 'Yelahanka, Bengaluru', coordinates: { lat: 13.1000, lng: 77.5960 }, status: 'AVAILABLE' },
            { supplier: sunriseBakery._id, foodName: 'Leftover Margherita Pizzas', description: 'Unsold whole medium pizzas.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', quantity: 8, availableQuantity: 8, unit: 'pizzas', foodType: 'Vegetarian', dietaryInformation: ['Contains Dairy'], pickupStart: now, pickupEnd: addHours(2), expiryTime: addHours(12), location: 'HSR Layout, Bengaluru', coordinates: { lat: 12.9150, lng: 77.6440 }, status: 'AVAILABLE' },
            { supplier: freshHarvest._id, foodName: 'Gulab Jamun', description: 'Sweet milk dumplings in rose syrup.', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600', quantity: 50, availableQuantity: 50, unit: 'pieces', foodType: 'Vegetarian', dietaryInformation: ['Contains Dairy', 'High Sugar'], pickupStart: now, pickupEnd: addHours(8), expiryTime: addHours(24), location: 'Jayanagar, Bengaluru', coordinates: { lat: 12.9300, lng: 77.5850 }, status: 'AVAILABLE' },
            { supplier: greenBowl._id, foodName: 'Ratnagiri Alphonso Mangoes', description: 'Slightly overripe but incredibly sweet.', image: 'https://images.unsplash.com/photo-1553279768-865429fd8b83?q=80&w=600', quantity: 20, availableQuantity: 5, unit: 'kg', foodType: 'Vegan', dietaryInformation: ['Organic'], pickupStart: now, pickupEnd: addHours(10), expiryTime: addHours(48), location: 'Whitefield, Bengaluru', coordinates: { lat: 12.9700, lng: 77.7500 }, status: 'RESERVED' },
            { supplier: sunriseBakery._id, foodName: 'Sourdough Loaves', description: 'Baked yesterday, perfect for toast.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600', quantity: 12, availableQuantity: 12, unit: 'loaves', foodType: 'Vegan', dietaryInformation: [], pickupStart: now, pickupEnd: addHours(12), expiryTime: addHours(72), location: 'Indiranagar, Bengaluru', coordinates: { lat: 12.9716, lng: 77.6411 }, status: 'AVAILABLE' }
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
