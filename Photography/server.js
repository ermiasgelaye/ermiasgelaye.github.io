const express = require('express');
const stripe = require('stripe')('sk_test_your_stripe_secret_key_here'); // Replace with your Stripe secret key
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Photography Portfolio API'
    });
});

// Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { imageId, title, price = 999 } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Unlimited Downloads - Photography Collection',
                        description: title || 'Access to all high-resolution photos',
                    },
                    unit_amount: price,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/Home.html?payment=success',
            cancel_url: 'http://localhost:3000/Home.html?payment=cancel',
            metadata: {
                imageId: imageId || 'unlimited',
                purchaseType: 'unlimited_downloads'
            }
        });

        res.json({ 
            success: true, 
            id: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Payment verification (for success page)
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        res.json({ 
            success: session.payment_status === 'paid',
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Serve Home.html as default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Home.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`
    🚀 Photography Portfolio Server Started!
    📍 Local: http://localhost:${PORT}
    
    📸 Home Page: http://localhost:${PORT}/Home.html
    🩺 Health Check: http://localhost:${PORT}/api/health
    
    💳 Payment Endpoints:
       POST /api/create-checkout-session
       POST /api/verify-payment
    
    ⚠️  Note: Replace Stripe keys with your own in server.js
    `);
});