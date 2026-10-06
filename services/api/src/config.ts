import { readFileSync } from "node:fs";

export function secret(name: string, env = process.env) {
  const value = env[`${name}_FILE`]
    ? readFileSync(env[`${name}_FILE`]!, "utf8").trim()
    : env[name];
  if (!value) throw new Error(`Thiếu cấu hình ${name}`);
  return value;
}
export function config() {
  const serviceToken = secret("API_SERVICE_TOKEN");
  if (serviceToken.length < 32)
    throw new Error("API_SERVICE_TOKEN phải có ít nhất 32 ký tự");
  return {
    serviceToken,
    uploadDir: process.env.UPLOAD_DIR || "/data/uploads",
    port: Number(process.env.PORT || 4000),
  };
}
