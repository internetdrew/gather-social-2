import { stripe } from "../utils/stripe";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
const domain = process.env.DOMAIN ?? "http://localhost:5173";

export const checkoutRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: "price_1Rv1LAKhtZ63tY5pW9r4Se2c", quantity: 1 }],
      mode: "payment",
      success_url: `${domain}/?success=true`,
      cancel_url: `${domain}/?canceled=true`,
      payment_method_types: ["card"],
      metadata: {
        userId: ctx.user.id,
        creditAmount: 1,
      },
    });

    if (!session.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return session.url;
  }),
});
