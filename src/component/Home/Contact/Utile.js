export function generateVisitorId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `${timestamp}-${random}`;
  }
