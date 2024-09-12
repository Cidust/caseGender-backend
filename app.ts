import express, { Application } from "express";
import router from "./router";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use((req, res, next) => {
  // 设置允许访问的来源，'*'表示任何来源都可以访问，但在生产环境中最好指定特定的域名
  res.header("Access-Control-Allow-Origin", "*");
  // 设置允许的请求方法
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // 设置允许的请求头部
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  // 设置是否允许发送带有凭证（如cookies）的请求
  res.header("Access-Control-Allow-Credentials");
  // 如果是预检请求（OPTIONS），直接返回
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Use the routes defined in router.ts
app.use("/", router);

// Start the server
const port = 7461;

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});
