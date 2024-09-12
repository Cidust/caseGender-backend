import express, { Router, Request, Response } from "express";
import { ansToAnsHash, askGener, getAccessToken } from "./global";
import jwt from "jsonwebtoken";
import { ans, mist, secret } from "./mist";
import { request } from "http";

const router: Router = express.Router();

router.get("/need", (req: Request, res: Response) => {
  const randomKey = Math.floor(Math.random() * mist.length);
  res.json({ mist: mist[randomKey], key: randomKey });
});

router.post("/vertify", (req: Request, res: Response) => {
  if (req.body.ans !== ansToAnsHash(req.body.key)) {
    res.status(403);
  } else {
    res.status(200);
    const payload = { userId: 114514, role: "xianbei" };

    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    res.json({ coke: token });
  }
});

router.get("/gener", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // 获取Bearer后面的部分

  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, secret, (err) => {
    if (err) {
      res.sendStatus(403);
      return;
    } // 如果token无效
  });

  res.json({ content: await askGener() });
});

export default router;
