import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exist in database");
      return;
    }

    const hashedPassword: string = await bcrypt.hash("090157", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "super@gmail.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "9876432139",
          },
        },
      },
    });

    console.log("super admin created successfully", superAdminData);
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};

seedSuperAdmin();
