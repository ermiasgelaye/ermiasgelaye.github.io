const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serve your HTML files
// Add a health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        services: {
            stripe: !!process.env.STRIPE_SECRET_KEY,
            paypal: !!process.env.PAYPAL_CLIENT_ID
        }
    });
});
// PayPal Setup
let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
);
if (process.env.PAYPAL_ENVIRONMENT === 'production') {
    environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_SECRET
    );
}
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, imageId } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Unlimited Downloads - Photography Collection',
                        description: 'Access to all high-resolution photos',
                    },
                    unit_amount: 999, // $9.99 in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_URL}/cancel.html`,
            metadata: {
                imageId: imageId || 'unlimited',
                userId: req.body.userId || 'anonymous'
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PayPal Order Creation
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
                description: 'Unlimited Downloads - Photography Collection'
            }]
        });

        const order = await paypalClient.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error('PayPal error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PayPal Order Capture
app.post('/api/capture-paypal-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const capture = await paypalClient.execute(request);
        
        // Here you would update your database to grant unlimited downloads
        res.json({ 
            success: true, 
            orderId: capture.result.id,
            message: 'Purchase successful! Unlimited downloads activated.'
        });
    } catch (error) {
        console.error('PayPal capture error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Stripe Payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            // Here you would update your database to grant unlimited downloads
            res.json({ 
                success: true, 
                message: 'Purchase successful! Unlimited downloads activated.',
                downloadsRemaining: 999
            });
        } else {
            res.json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});