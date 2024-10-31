// const express = require('express');
// const PesapalV30Helper = require('./helpers/pesapalV30Helper');
// const app = express();
// const PORT = process.env.PORT || 3001;

// require('dotenv').config();


// app.use(express.json()); // Enable JSON parsing

// const pesapalHelper = new PesapalV30Helper('demo'); // Use 'live' for production

// // Middleware to generate access token for every request
// const generateAccessTokenMiddleware = async (req, res, next) => {
//   try {
//     const tokenData = await pesapalHelper.getAccessToken(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
//     req.accessToken = tokenData.token;  // Store the token in the request object
//     // console.log('Access Token Generated:', req.accessToken);
//     next();  // Proceed to the next middleware or route handler
//   } catch (error) {
//     // console.error('Error generating access token:', error.message);
//     res.status(500).json({ error: 'Error generating access token' });
//   }
// };

// // Apply the middleware to the routes that need a fresh token
// app.use(generateAccessTokenMiddleware);

// // Route for submitting an order
// app.post('/api/submit-order', async (req, res) => {
//     const orderPayload = req.body;

//     const request = {
//         id: orderPayload.id,
//         currency: orderPayload.currency,
//         amount: orderPayload.amount,
//         description: orderPayload.description,
//         callback_url: orderPayload.callback_url,
//         notification_id: orderPayload.notification_id,
//         billing_address: orderPayload.billing_address,
//     };

//     if (!request.id || !request.currency || !request.amount || !request.callback_url || !request.notification_id) {
//         return res.status(400).json({ error: 'Required fields are missing in the request payload' });
//     }

//     try {
//         // Use the accessToken from the middleware
//         const orderResponse = await pesapalHelper.submitOrder(request, req.accessToken);
//         res.json(orderResponse);
//     } catch (error) {
//         console.error('Error submitting order:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Route for registering IPN
// app.post('/api/register-ipn', async (req, res) => {
//   const { ipn_notification_type, url } = req.body;

//   if (!ipn_notification_type || !url) {
//     return res.status(400).json({ error: 'ipn_notification_type and callbackUrl are required' });
//   }

//   try {
//     const ipnResponse = await pesapalHelper.registerIPN(req.accessToken, {
//       ipn_notification_type,
//       url,
//     });
//     res.json(ipnResponse);
//   } catch (error) {
//     // console.error('Error registering IPN:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route for getting transaction status
// app.get('/api/transaction-status', async (req, res) => {
//   const { orderTrackingId } = req.query;

//   try {
//     const statusResponse = await pesapalHelper.getTransactionStatus(orderTrackingId, req.accessToken);
//     res.json(statusResponse);
//   } catch (error) {
//     console.error('Error fetching transaction status:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// const express = require('express');
// const cors = require('cors');
// const PesapalV30Helper = require('./helpers/pesapalV30Helper');
// const app = express();
// const PORT = process.env.PORT || 3001;

// require('dotenv').config();

// // Enable CORS for all routes
// app.use(cors());
// app.use(express.json()); // Enable JSON parsing

// const pesapalHelper = new PesapalV30Helper('demo'); // Use 'live' for production

// // Middleware to generate access token for every request
// const generateAccessTokenMiddleware = async (req, res, next) => {
//   try {
//     const tokenData = await pesapalHelper.getAccessToken(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
//     req.accessToken = tokenData.token;  // Store the token in the request object
//     next();  // Proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(500).json({ error: 'Error generating access token' });
//   }
// };

// // Apply the middleware to the routes that need a fresh token
// app.use(generateAccessTokenMiddleware);

// // Payment Callback Endpoint
// app.post('/api/payment-callback', (req, res) => {
//   const paymentData = req.body;
//   console.log("Payment Callback Data:", paymentData);

//   const { orderTrackingId, status, transactionId } = paymentData;

//   // Update your database or perform any required actions based on the payment status
//   if (status === "COMPLETED") {
//     console.log(`Order ${orderTrackingId} completed successfully.`);
//   } else if (status === "FAILED") {
//     console.log(`Order ${orderTrackingId} failed.`);
//   }

//   res.status(200).send("Callback received");
// });

// // Route for submitting an order
// app.post('/api/submit-order', async (req, res) => {
//   const orderPayload = req.body;

//   const request = {
//     id: orderPayload.id,
//     currency: orderPayload.currency,
//     amount: orderPayload.amount,
//     description: orderPayload.description,
//     callback_url: "http://localhost:3001/api/payment-callback", // Use the full URL to this callback endpoint
//     notification_id: orderPayload.notification_id,
//     billing_address: orderPayload.billing_address,
//   };

//   if (!request.id || !request.currency || !request.amount || !request.callback_url || !request.notification_id) {
//     return res.status(400).json({ error: 'Required fields are missing in the request payload' });
//   }

//   try {
//     const orderResponse = await pesapalHelper.submitOrder(request, req.accessToken);
//     res.json(orderResponse);
//   } catch (error) {
//     console.error('Error submitting order:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Register IPN Listener Route
// app.post('/api/register-ipn', async (req, res) => {
//   try {
//     const { url, ipnScope } = req.body; // Accept IPN URL and scope from request body
//     const ipnResponse = await pesapalHelper.registerIPN(url, ipnScope, req.accessToken);
//     res.json(ipnResponse);
//   } catch (error) {
//     console.error('Error registering IPN:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get Order Status Route
// app.get('/api/order-status/:orderTrackingId', async (req, res) => {
//   const { orderTrackingId } = req.params;
  
//   try {
//     const orderStatus = await pesapalHelper.getOrderStatus(orderTrackingId, req.accessToken);
//     res.json(orderStatus);
//   } catch (error) {
//     console.error('Error fetching order status:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // List Transactions Route
// app.get('/api/list-transactions', async (req, res) => {
//   try {
//     const transactions = await pesapalHelper.listTransactions(req.accessToken);
//     res.json(transactions);
//   } catch (error) {
//     console.error('Error listing transactions:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const PesapalV30Helper = require('./helpers/pesapalV30Helper');
const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Enable JSON parsing

const pesapalHelper = new PesapalV30Helper('demo'); // Use 'live' for production

// Middleware to generate access token for every request
const generateAccessTokenMiddleware = async (req, res, next) => {
  try {
    const tokenData = await pesapalHelper.getAccessToken(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
    req.accessToken = tokenData.token;  // Store the token in the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error generating access token:', error.message);
    res.status(500).json({ error: 'Error generating access token' });
  }
};

// Apply the middleware to the routes that need a fresh token
app.use(generateAccessTokenMiddleware);

// Payment Callback Endpoint
app.post('/api/payment-callback', (req, res) => {
  const paymentData = req.body;
  console.log("Payment Callback Data:", paymentData);

  const { orderTrackingId, status, transactionId } = paymentData;

  // Update your database or perform any required actions based on the payment status
  if (status === "COMPLETED") {
    console.log(`Order ${orderTrackingId} completed successfully.`);
  } else if (status === "FAILED") {
    console.log(`Order ${orderTrackingId} failed.`);
  }

  res.status(200).send("Callback received");
});

// Route for submitting an order
app.post('/api/submit-order', async (req, res) => {
  const orderPayload = req.body;

  const request = {
    id: orderPayload.id,
    currency: orderPayload.currency,
    amount: orderPayload.amount,
    description: orderPayload.description,
    callback_url: "http://localhost:3001/api/payment-callback", // Use the full URL to this callback endpoint
    notification_id: orderPayload.notification_id,
    billing_address: orderPayload.billing_address,
  };

  if (!request.id || !request.currency || !request.amount || !request.callback_url || !request.notification_id) {
    return res.status(400).json({ error: 'Required fields are missing in the request payload' });
  }

  try {
    const orderResponse = await pesapalHelper.submitOrder(request, req.accessToken);
    res.json(orderResponse);
  } catch (error) {
    console.error('Error submitting order:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Register IPN Listener Route
app.post('/api/register-ipn', async (req, res) => {
  const { url, ipn_notification_type = 'GET' } = req.body; // Accept IPN URL and notification type from request body
  if (!url) {
    return res.status(400).json({ error: 'IPN URL is required' });
  }

  try {
    const ipnResponse = await pesapalHelper.registerIPN(req.accessToken, { ipn_notification_type, url });
    res.json(ipnResponse);
  } catch (error) {
    console.error('Error registering IPN:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Order Status Route
app.get('/api/order-status/:orderTrackingId', async (req, res) => {
  const { orderTrackingId } = req.params;

  try {
    const orderStatus = await pesapalHelper.getTransactionStatus(orderTrackingId, req.accessToken);
    res.json(orderStatus);
  } catch (error) {
    console.error('Error fetching order status:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// List Transactions Route
app.get('/api/list-transactions', async (req, res) => {
  try {
    const transactions = await pesapalHelper.listTransactions(req.accessToken);
    res.json(transactions);
  } catch (error) {
    console.error('Error listing transactions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
