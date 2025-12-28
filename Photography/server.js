const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables first

// Initialize Express
const app = express();

// 1. Security & Middleware
app.use(cors()); // Allows your frontend (on a different port) to talk to this server
app.use(express.json());
app.use(express.static('public')); // Optional: if you serve images/html from here later

// 2. Stripe Setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 3. PayPal Setup
const paypal = require('@paypal/checkout-server-sdk');

// Dynamic PayPal Environment (Sandbox vs Production)
let environment;
if (process.env.PAYPAL_ENVIRONMENT === 'production') {
    environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
    );
} else {
    environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
    );
}
const paypalClient = new paypal.core.PayPalHttpClient(environment);


// --- ROUTES ---

// Endpoint: Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { imageId, userId } = req.body;
        
        // Use SITE_URL from .env to ensure user is redirected back to the correct place
        const siteUrl = process.env.SITE_URL || 'http://localhost:5500';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Unlimited Downloads Access',
                        description: 'One-time payment for unlimited photo downloads (Portfolio)',
                    },
                    unit_amount: 999, // $9.99 USD
                },
                quantity: 1,
            }],
            mode: 'payment',
            // Success URL redirects users back to your success page
            success_url: `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/Home.html`,
            metadata: {
                userId: userId,
                imageId: imageId
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Create PayPal Order
app.post('/api/create-paypal-order', async (req, res) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: '9.99'
                },
                description: 'Unlimited Downloads Access'
            }]
        });

        const order = await paypalClient.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error('PayPal order error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Capture PayPal Payment
app.post('/api/capture-paypal-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const capture = await paypalClient.execute(request);
        
        // Log the success (In a real app, you would update your database here)
        console.log('PayPal Payment captured:', capture.result.id);
        
        res.json({ 
            success: true, 
            transactionId: capture.result.id,
            message: 'Payment successful' 
        });
    } catch (error) {
        console.error('PayPal capture error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Expecting frontend at: ${process.env.SITE_URL || 'undefined (check .env)'}`);
});