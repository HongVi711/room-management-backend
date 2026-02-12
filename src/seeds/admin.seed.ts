// import bcrypt from "bcryptjs";
// import User from "../models/user.model";
// import { ROLE } from "../utils/app.constants";

// export const seedAdminUser = async () => {
//   try {
//     const existingAdmin = await User.findOne({
//       email: "admin@gmail.com",
//     });

//     if (existingAdmin) {
//       console.log("✅ Admin already exists");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash("123456", 10);

//     await User.create({
//       email: "admin@gmail.com",
//       name: "System Admin",
//       password: hashedPassword,
//       role: ROLE.OWNER,
//       phone: "0123456789",
//       cccd: "",
//       cccdImages: {
//         front: { url: "", publicId: "" },
//         back: { url: "", publicId: "" },
//       },
//     });

//     console.log("🔥 Admin user created successfully");
//     console.log("Email: admin@gmail.com");
//     console.log("Password: 123456");
//   } catch (error) {
//     console.error("❌ Error seeding admin:", error);
//   }
// };
