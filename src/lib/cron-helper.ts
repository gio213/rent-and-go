// (optional) protect cron with a header
export function authorized(req: Request) {
  const need = process.env.CRON_SECRET;
  return !need || req.headers.get("x-cron-secret") === need;
}
