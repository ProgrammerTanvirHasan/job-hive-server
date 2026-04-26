export default function errorHandler(
  err: any,
  _req: any,
  res: any,
  _next: any,
) {
  console.error("🔥 FULL ERROR:", err);
  console.error("🔥 STACK:", err?.stack);

  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
}
