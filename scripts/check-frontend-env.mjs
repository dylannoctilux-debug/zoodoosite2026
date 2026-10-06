const forbidden = [
  "MONGODB_URI",
  "MONGODB_URI_FILE",
  "EMAIL_SMTP_USER",
  "EMAIL_SMTP_USER_FILE",
  "EMAIL_SMTP_PASSWORD",
  "EMAIL_SMTP_PASSWORD_FILE",
];
if (forbidden.some((name) => process.env[name])) {
  console.error(
    "Frontend không được nhận credentials database hoặc SMTP. Chuyển cấu hình này sang API trước khi build.",
  );
  process.exit(1);
}
if (
  process.env.VERCEL_ENV === "production" &&
  process.env.VERCEL_GIT_COMMIT_REF !== "main"
) {
  console.error(
    "Production chỉ được build từ main, sau staging đã kiểm chứng.",
  );
  process.exit(1);
}
