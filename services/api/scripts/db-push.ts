import { spawnSync } from "node:child_process";
import { secret } from "../src/config";
const uri = secret("MONGODB_URI");
const result = spawnSync(
  "pnpm",
  ["exec", "prisma", "db", "push", "--schema", "schema.prisma"],
  {
    encoding: "utf8",
    maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, MONGODB_URI: uri },
  },
);
let output = `${result.stdout || ""}${result.stderr || ""}`;
const values = [uri];
try {
  const u = new URL(uri);
  values.push(
    u.username,
    u.password,
    decodeURIComponent(u.username),
    decodeURIComponent(u.password),
  );
} catch {}
for (const value of values.filter(Boolean).sort((a, b) => b.length - a.length))
  output = output.split(value).join("[REDACTED]");
console.log(
  output || "Không chạy được Prisma CLI. Kiểm tra cấu hình trên máy chủ API.",
);
process.exit(result.status ?? 1);
