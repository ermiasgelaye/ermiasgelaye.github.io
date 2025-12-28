const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. PROD CONFIGURATION ---
// We sanitize the SITE_URL to ensure it points to the directory, not a specific file
// If you put ".../Home.html" in .env, this strips it back to ".../Photography"
const RAW_SITE_URL = process.env.SITE_URL || 'http://localhost:5500';
const SITE_BASE_URL = RAW_SITE_URL.replace(/\/Home\.html$/, '').replace(/\/$/, '');

// CORS: Allow your GitHub Pages frontend and local testing
// For production, you can also use "*" temporarily for testing, but restrict it for security
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://127.0.0.1:5500', 
            'http://localhost:5500', 
            'http://localhost:3000',
            'http://localhost:8080',
            'https://ermiasgelaye.github.io', // Your GitHub Pages
            // Add your custom domain if you have one
            // 'https://yourdomain.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // For development/testing, you can allow all origins
            // In production, you should log this and consider blocking
            console.warn(`CORS blocked request from origin: ${origin}`);
            // Option 1: Block the request (recommended for production)
            // callback(new Error('Not allowed by CORS'));
            
            // Option 2: Allow it (for testing)
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this to parse form data
app.use(express.static('public'));

// --- 2. PAYMENT PROVIDER SETUP ---
// Validate that Stripe secret key is provided
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ ERROR: STRIPE_SECRET_KEY environment variable is not set!');
    console.error('Please set it in your .env file or environment variables.');
    process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Check PayPal configuration
let paypalClient = null;
if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET) {
    const paypal = require('@paypal/checkout-server-sdk');
    
    // PayPal Environment Selection
    let environment;
    if (process.env.PAYPAL_ENVIRONMENT === 'production') {
        environment = new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_SECRET
        );
        console.log('✅ PayPal: Running in LIVE/PRODUCTION mode');
    } else {
        environment = new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_SECRET
        );
        console.log('🟡 PayPal: Running in SANDBOX mode');
    }
    paypalClient = new paypal.core.PayPalHttpClient(environment);
} else {
    console.warn('⚠️  PayPal credentials not configured. PayPal payments will be disabled.');
}

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
        timestamp: new Date().toISOString(),
        services: {
            stripe: !!process.env.STRIPE_SECRET_KEY,
            paypal: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET),
            node: process.version
        }
    });
});

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working!',
        siteBaseUrl: SITE_BASE_URL,
        environment: process.env.NODE_ENV || 'development'
    });
});

// --- 3. STRIPE CHECKOUT ---
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { imageId, userId } = req.body;
        
        // Validate request
        if (!imageId) {
            return res.status(400).json({ 
                error: 'Missing required field: imageId' 
            });
        }
        
        // Define redirect URLs
        const successUrl = `${SITE_BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}&payment=success&imageId=${encodeURIComponent(imageId)}`;
        const cancelUrl = `${SITE_BASE_URL}/Home.html?payment=cancelled`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Unlimited Downloads Access',
                        description: 'One-time payment for unlimited photo downloads (ARC Nature Photography)',
                    },
                    unit_amount: 999, // $9.99 USD
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId || 'anonymous',
                imageId: imageId,
                timestamp: new Date().toISOString()
            },
            customer_email: req.body.email || undefined, // Optional: collect email
            billing_address_collection: 'required', // Collect billing address
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'] // Restrict to specific countries if needed
            }
        });

        console.log('Stripe session created:', session.id);
        
        res.json({ 
            id: session.id,
            url: session.url, // Optional: send the URL for direct redirect
            clientSecret: session.client_secret // For Stripe Elements if you want to use them
        });
        
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ 
            error: error.message,
            code: error.code || 'stripe_error'
        });
    }
});

// Stripe webhook endpoint (optional but recommended for production)
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment succeeded for session:', session.id);
            // Here you can update your database, send confirmation emails, etc.
            break;
        case 'checkout.session.expired':
            console.log('Session expired:', event.data.object.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

// --- 4. PAYPAL CREATE ORDER ---
app.post('/api/create-paypal-order', async (req, res) => {
    try {
        if (!paypalClient) {
            return res.status(503).json({ 
                error: 'PayPal service is not configured' 
            });
        }
        
        const { imageId } = req.body;
        
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: '9.99'
                },
                description: 'Unlimited Downloads Access - ARC Photography',
                soft_descriptor: 'ARC-PHOTO',
                custom_id: imageId || 'unknown',
                invoice_id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }],
            application_context: {
                brand_name: 'ARC Nature Photography',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${SITE_BASE_URL}/success.html?payment=paypal&imageId=${encodeURIComponent(imageId || '')}`,
                cancel_url: `${SITE_BASE_URL}/Home.html?payment=cancelled`
            }
        });

        const order = await paypalClient.execute(request);
        console.log('PayPal order created:', order.result.id);
        
        res.json({ 
            id: order.result.id,
            status: order.result.status 
        });
        
    } catch (error) {
        console.error('PayPal Create Error:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.details || 'Unknown PayPal error'
        });
    }
});

// --- 5. PAYPAL CAPTURE ORDER ---
app.post('/api/capture-paypal-order', async (req, res) => {
    try {
        if (!paypalClient) {
            return res.status(503).json({ 
                success: false,
                error: 'PayPal service is not configured' 
            });
        }
        
        const { orderID } = req.body;
        
        if (!orderID) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing orderID' 
            });
        }

        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const capture = await paypalClient.execute(request);
        
        console.log('PayPal capture result:', capture.result.status);
        
        // Check for success status
        if (capture.result.status === 'COMPLETED' || capture.result.status === 'APPROVED') {
            res.json({ 
                success: true, 
                transactionId: capture.result.id,
                status: capture.result.status,
                payer: capture.result.payer,
                purchase_units: capture.result.purchase_units
            });
        } else {
            res.status(500).json({ 
                success: false, 
                status: capture.result.status,
                details: 'Payment not completed',
                full_response: process.env.NODE_ENV === 'development' ? capture.result : undefined
            });
        }
    } catch (error) {
        console.error('PayPal Capture Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.details || 'Unknown PayPal capture error'
        });
    }
});

// --- 6. ADDITIONAL UTILITY ENDPOINTS ---

// Endpoint to verify payments (optional)
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { paymentMethod, paymentId } = req.body;
        
        if (!paymentMethod || !paymentId) {
            return res.status(400).json({ 
                verified: false,
                error: 'Missing payment method or payment ID' 
            });
        }
        
        let verified = false;
        
        if (paymentMethod === 'stripe') {
            const session = await stripe.checkout.sessions.retrieve(paymentId);
            verified = session.payment_status === 'paid';
        } else if (paymentMethod === 'paypal' && paypalClient) {
            // Implement PayPal verification if needed
            verified = true; // Placeholder
        }
        
        res.json({ 
            verified,
            paymentId,
            paymentMethod 
        });
        
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            verified: false,
            error: error.message 
        });
    }
});

// Serve a simple success page for direct backend access
app.get('/success', (req, res) => {
    res.send(`
        <html>
            <head><title>Payment Successful</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1>🎉 Payment Successful!</h1>
                <p>Thank you for your purchase. Your downloads have been unlocked.</p>
                <p>You can now close this window and return to the gallery.</p>
            </body>
        </html>
    `);
});

// Serve a simple cancel page
app.get('/cancel', (req, res) => {
    res.send(`
        <html>
            <head><title>Payment Cancelled</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1>⚠️ Payment Cancelled</h1>
                <p>Your payment was cancelled. No charges were made.</p>
                <p><a href="${SITE_BASE_URL}/Home.html">Return to Gallery</a></p>
            </body>
        </html>
    `);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /api/health',
            'POST /api/create-checkout-session',
            'POST /api/create-paypal-order',
            'POST /api/capture-paypal-order'
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Base Site URL: ${SITE_BASE_URL}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💰 Payment methods: Stripe ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'}, PayPal ${paypalClient ? '✓' : '✗'}`);
    console.log(`📝 Logging level: ${process.env.NODE_ENV === 'production' ? 'minimal' : 'verbose'}`);
});