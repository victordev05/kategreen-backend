const prisma = require("../config/prisma");

async function logAction(userId, action) {
  console.log(`[AUDIT] ${userId} -> ${action}`);

  // later we can store in DB if needed
}

module.exports = { logAction };