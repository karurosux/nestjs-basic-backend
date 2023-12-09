-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('HQ', 'LEAF');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('COMMON', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "PermissionCategory" AS ENUM ('CUSTOMER_MANAGEMENT', 'USER_MANAGEMENT', 'ROLE_MANAGEMENT', 'BRANCH_MANAGEMENT');

-- CreateTable
CREATE TABLE "branch" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "city" VARCHAR(128) NOT NULL,
    "province" VARCHAR(128) NOT NULL,
    "zipcode" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "branchType" "BranchType" NOT NULL DEFAULT 'LEAF',

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "branchId" VARCHAR(64),
    "roleType" "RoleType" NOT NULL DEFAULT 'COMMON',

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(64) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(128) NOT NULL,
    "branchId" VARCHAR(64) NOT NULL,
    "roleId" VARCHAR(64) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" VARCHAR(64) NOT NULL,
    "category" "PermissionCategory" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "roleId" VARCHAR(64) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_email_key" ON "branch"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
