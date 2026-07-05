const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { admin } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const Anthropic = require('@anthropic-ai/sdk');

admin.initializeApp();
const db = getFirestore();

// AI Proxy Function - with premium check
exports.callAI = onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Foydalanuvchi autentifikatsiyadan o\'tmagan');
  }

  const userId = context.auth.uid;

  try {
    // Get user subscription status
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Foydalanuvchi topilmadi');
    }

    const userData = userDoc.data();
    const { subscriptionTier, subscriptionExpiresAt } = userData;

    // Premium check
    if (subscriptionTier === 'free') {
      throw new HttpsError('permission-denied', 'AI funksiyalari faqat premium foydalanuvchilar uchun');
    }

    // Check if subscription is expired
    if (subscriptionExpiresAt && new Date(subscriptionExpiresAt) < new Date()) {
      throw new HttpsError('permission-denied', 'Obuna muddati tugagan. Iltimos, obunani yangilang.');
    }

    // Get API key from secrets
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new HttpsError('internal', 'AI API kaliti topilmadi');
    }

    // Call Anthropic API
    const anthropic = new Anthropic({ apiKey });
    const { prompt, type } = data;

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'search':
        systemPrompt = 'You are a warehouse search assistant. Parse the user query and extract search parameters in JSON format: { region, sizeSqm, category, maxPrice, minPrice }. Return only JSON.';
        userPrompt = prompt;
        break;
      case 'recommendation':
        systemPrompt = 'You are a warehouse recommendation assistant. Given a warehouse description, find similar warehouses and explain why they are similar. Provide detailed reasoning.';
        userPrompt = prompt;
        break;
      case 'description':
        systemPrompt = 'You are a warehouse listing description writer. Write a compelling, sales-oriented description in Uzbek language based on the provided warehouse details. Make it professional and attractive.';
        userPrompt = prompt;
        break;
      default:
        throw new HttpsError('invalid-argument', 'Noto\'g\'ri so\'rov turi');
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    return {
      success: true,
      response: message.content[0].text
    };

  } catch (error) {
    console.error('AI call error:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'AI so\'rovini bajarishda xatolik yuz berdi');
  }
});

// Payment Webhook Function
exports.paymentWebhook = onCall(async (data, context) => {
  // Auth check (only server-to-server calls should use this)
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Autentifikatsiya talab qilinadi');
  }

  const { paymentProvider, transactionId, warehouseId, planType, amount } = data;

  try {
    // Verify payment with provider (Click.uz or Payme)
    // This is a simplified version - you should implement proper verification
    
    let isValidPayment = false;
    
    // Implement provider-specific verification
    if (paymentProvider === 'click') {
      // Verify with Click.uz API
      isValidPayment = await verifyClickPayment(transactionId, amount);
    } else if (paymentProvider === 'payme') {
      // Verify with Payme API
      isValidPayment = await verifyPaymePayment(transactionId, amount);
    }

    if (!isValidPayment) {
      throw new HttpsError('failed-precondition', 'To\'lov tasdiqlanmadi');
    }

    // Update warehouse or user subscription based on plan type
    if (planType === 'premium_listing') {
      // Update warehouse premium status
      const premiumExpiresAt = new Date();
      premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);

      await db.collection('warehouses').doc(warehouseId).update({
        isPremium: true,
        premiumExpiresAt: premiumExpiresAt,
        updatedAt: new Date()
      });
    } else if (planType === 'subscription') {
      // Update user subscription
      const subscriptionExpiresAt = new Date();
      subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1);

      const userId = context.auth.uid;
      await db.collection('users').doc(userId).update({
        subscriptionTier: planType === 'standard' ? 'standard' : 'business',
        subscriptionExpiresAt: subscriptionExpiresAt
      });
    }

    return {
      success: true,
      message: 'To\'lov muvaffaqiyatli qabul qilindi'
    };

  } catch (error) {
    console.error('Payment webhook error:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'To\'lovni qayta ishlashda xatolik yuz berdi');
  }
});

// Helper functions for payment verification
async function verifyClickPayment(transactionId, amount) {
  // Implement Click.uz API verification
  // This is a placeholder - implement actual API call
  return true;
}

async function verifyPaymePayment(transactionId, amount) {
  // Implement Payme API verification
  // This is a placeholder - implement actual API call
  return true;
}
