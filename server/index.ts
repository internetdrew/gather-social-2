import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { publicProcedure, router, createContext } from "./trpc";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { createServerSupabaseClient } from "./supabase";
import cookieParser from "cookie-parser";
import { eventRouter } from "./routers/event";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const appRouter = router({
  event: eventRouter,
  greeting: publicProcedure
    .input(z.object({ intro: z.string() }))
    .query((opts) => {
      const { input } = opts;
      return `${input.intro} LyteStack` as const;
    }),
});

const corsOptions = {
  origin: ["http://localhost:5173", "https://gather-social-2.vercel.app"],
  credentials: true,
};

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
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
