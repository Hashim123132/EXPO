import Stripe from "stripe";

export default async function main(req, res) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Parse body (Appwrite passes req.body as string)
    const body = JSON.parse(req.body || "{}");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount, // amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.json({ error: error.message }, 500);
  }
}
