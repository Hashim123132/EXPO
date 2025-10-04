import Stripe from "stripe";

export default async function main(context) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    context.error("Stripe key not found");
    return context.res.json({ error: "Stripe key not found" }, 500);
  }

  const bodyRaw = context.req.bodyRaw || '{}';
  const body = JSON.parse(bodyRaw);
  const amount = parseInt(body.amount, 10);

  if (!amount) {
    context.error("Missing amount in request body");
    return context.res.json({ error: "Missing amount" }, 400);
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-08-27.basil" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Order Payment" },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://stripe-bridge-six.vercel.app//stripe-redirect?redirect_status=succeeded",
    cancel_url: "https://stripe-bridge-six.vercel.app//stripe-redirect?redirect_status=failed",
  });

  if (!session.url) {
    return context.res.json({ error: "No checkout URL returned" }, 500);
  }

  return context.res.json({ checkoutUrl: session.url });
}
  