import {PermissionCategory, Prisma, RoleType} from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export const getBranchSeed = async () => {
  const branch: Prisma.BranchCreateArgs = {
    data: {
      name: 'HQ Branch',
      city: 'San Diego',
      province: 'California',
      zipcode: '92110',
      branchType: 'HQ',
      phone: 'No Phone',
      email: 'admin@admin.com',
      roles: {
        create: [
          {
            name: 'Super Admin',
            roleType: RoleType.SUPER_ADMIN,
            permissions: {
              create: [
                {
                  category: PermissionCategory.CUSTOMER_MANAGEMENT,
                  read: true,
                  write: true,
                },
                {
                  category: PermissionCategory.USER_MANAGEMENT,
                  read: true,
                  write: true,
                },
                {
                  category: PermissionCategory.ROLE_MANAGEMENT,
                  read: true,
                  write: true,
                },
                {
                  category: PermissionCategory.BRANCH_MANAGEMENT,
                  read: true,
                  write: true,
                },
              ],
            },
            users: {
              create: [
                {
                  email: 'admin@admin.com',
                  firstName: 'Admin',
                  lastName: 'Admin',
                  password: await hashPassword('Pass123!'),
                  branch: {
                    connect: {
                      email: 'admin@admin.com',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      users: true,
    },
  };
  return branch;
};
