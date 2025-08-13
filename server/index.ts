import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { router, createContext } from "./trpc";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { createServerSupabaseClient } from "./supabase";
import cookieParser from "cookie-parser";
import { eventRouter } from "./routers/event";
import { stripeHandler } from "./handlers/stripe";
import { checkoutRouter } from "./routers/checkout";
import { creditRouter } from "./routers/credit";
import { qrRouter } from "./routers/qr";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const appRouter = router({
  event: eventRouter,
  checkout: checkoutRouter,
  credit: creditRouter,
  qr: qrRouter,
});

const corsOptions = {
  origin: ["http://localhost:5173", "https://gather-social-2.vercel.app"],
  credentials: true,
};

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use("/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.get("/auth/callback", async function (req, res) {
  const code = req.query.code;
  const next = req.query.next ?? "/";

  if (code) {
    const supabase = createServerSupabaseClient(req, res);
    await supabase.auth.exchangeCodeForSession(code as string);
  }
  res.redirect(303, `/${(next as string)?.slice(1)}`);
});

app.post("/webhook", stripeHandler);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

export type AppRouter = typeof appRouter;
