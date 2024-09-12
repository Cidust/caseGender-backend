import { ans } from "./mist";
import crypto from "crypto";
import { content, system } from "./prompt";

import fs from "fs";
import util from "util";

export function ansToAnsHash(tempKey: number) {
  const myHash = crypto.createHash("sha256");
  const ansSHA = myHash.update(ans[tempKey]).digest("hex");

  return ansSHA;
}

const readFileAsync = util.promisify(fs.readFile);

async function readAccess() {
  try {
    // 读取文件内容
    const data = await readFileAsync("./tornade.txt", "utf8");

    // 使用换行符分割文件内容为数组
    const lines = data.split("\n");

    // 检查是否有足够的行数
    if (lines.length < 2) {
      throw new Error("The file does not contain enough lines.");
    }

    // 获取第一行和第二行的内容
    const a = lines[0];
    const b = lines[1];

    // 返回结果
    return { a, b };
  } catch (error) {
    console.error("Error reading file:", error);
    // 可以选择在这里抛出错误或返回默认值
    throw error;
  }
}

export async function getAccessToken() {
  const { a, b } = await readAccess();

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: a,
      client_secret: b,
    }),
  };

  const data = await fetch("https://aip.baidubce.com/oauth/2.0/token", options);
  const dataJson: any = await data.json();
  return dataJson.access_token;
}

export async function askGener() {
  const accessToken = await getAccessToken();

  const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed?access_token=${accessToken}`;

  const payload = {
    messages: [
      {
        role: "user",
        content: content,
        system: system,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result: any = await response.json();

    const regex = /```json([\s\S]*?)```/;

    let match = result.result.match(regex);
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
