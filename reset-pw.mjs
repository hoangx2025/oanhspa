import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const NEW_PASSWORD = "123456"; // <-- Đổi mật khẩu mới ở đây

const p = new PrismaClient();

// Liệt kê users
const users = await p.aspNetUsers.findMany({ select: { id: true, email: true } });
console.log("Users hiện tại:");
users.forEach((u, i) => console.log(`  ${i + 1}. ${u.email} (${u.id})`));

// Reset cho user đầu tiên (hoặc sửa index)
const target = users[0];
if (!target) {
  console.log("Không có user nào!");
  process.exit(1);
}

const hash = await bcrypt.hash(NEW_PASSWORD, 10);
await p.aspNetUsers.update({
  where: { id: target.id },
  data: { passwordHash: hash },
});

console.log(`\nĐã reset mật khẩu cho: ${target.email}`);
console.log(`Mật khẩu mới: ${NEW_PASSWORD}`);

await p.$disconnect();
