const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// 🔐 REGISTER USER + AUTO WALLET
async function registerUser(data) {
  const { fullName, email, phone, password, role } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "CUSTOMER",
      wallet: {
        create: {
          availableBalance: 0,
          pendingBalance: 0,
          frozenBalance: 0,
        },
      },
    },
    include: {
      wallet: true,
    },
  });

  // remove password before returning
  const { password: pwd, ...safeUser } = user;

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: safeUser,
    token,
  };
}

// 🔐 LOGIN USER
async function loginUser(identifier, password) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
    include: {
      wallet: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // remove password before returning
  const { password: pwd, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};