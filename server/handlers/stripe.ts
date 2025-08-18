import { Request, Response } from "express";
import stripe from "stripe";
import { supabaseAdminClient } from "../supabase";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!endpointSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export const stripeHandler = async (req: Request, res: Response) => {
  let event = req.body;
  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature as string,
        endpointSecret,
      );
    } catch (err) {
      if (err instanceof Error) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object;
        console.log("Checkout session completed:", checkoutSession.id);

        if (checkoutSession.payment_status === "paid") {
          console.log("Payment completed for session:", checkoutSession.id);

          const userId = checkoutSession.metadata.userId;
          const creditAmount = parseInt(
            checkoutSession.metadata?.creditAmount || "0",
          );

          if (userId && creditAmount > 0) {
            const { data, error } = await supabaseAdminClient
              .from("user_credits")
              .insert({
                user_id: userId,
                stripe_session_id: checkoutSession.id,
              })
              .select()
              .single();

            if (error) {
              console.error("Error adding user credits:", error);
            } else {
              console.log("Credits added successfully:", data);
            }
          }
        }

        break;
      }
      case "payment_intent.succeeded": {
        console.log("Payment intent succeeded:", event.data.object);
        break;
      }
      default: {
        console.log(`Unhandled event type ${event.type}`);
        break;
      }
    }

    res.json({ received: true });
  }
};
