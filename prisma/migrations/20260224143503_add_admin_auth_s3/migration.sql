-- CreateTable
CREATE TABLE "AspNetUsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userName" TEXT,
    "normalizedUserName" TEXT,
    "email" TEXT,
    "normalizedEmail" TEXT,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "securityStamp" TEXT,
    "concurrencyStamp" TEXT,
    "phoneNumber" TEXT,
    "phoneNumberConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lockoutEnd" DATETIME,
    "lockoutEnabled" BOOLEAN NOT NULL DEFAULT true,
    "accessFailedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AspNetRoles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "normalizedName" TEXT,
    "concurrencyStamp" TEXT
);

-- CreateTable
CREATE TABLE "AspNetUserRoles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "roleId"),
    CONSTRAINT "AspNetUserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AspNetUsers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AspNetUserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AspNetRoles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AspNetUserClaims" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "claimType" TEXT,
    "claimValue" TEXT,
    CONSTRAINT "AspNetUserClaims_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AspNetUsers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AspNetRoleClaims" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" TEXT NOT NULL,
    "claimType" TEXT,
    "claimValue" TEXT,
    CONSTRAINT "AspNetRoleClaims_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AspNetRoles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AspNetUserLogins" (
    "loginProvider" TEXT NOT NULL,
    "providerKey" TEXT NOT NULL,
    "providerDisplayName" TEXT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("loginProvider", "providerKey"),
    CONSTRAINT "AspNetUserLogins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AspNetUsers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AspNetUserTokens" (
    "userId" TEXT NOT NULL,
    "loginProvider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,

    PRIMARY KEY ("userId", "loginProvider", "name"),
    CONSTRAINT "AspNetUserTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AspNetUsers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "S3Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL DEFAULT 'default',
    "bucket" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "accessKeyId" TEXT NOT NULL,
    "secretAccessKey" TEXT NOT NULL,
    "endpoint" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AspNetUsers_userName_key" ON "AspNetUsers"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "AspNetUsers_normalizedUserName_key" ON "AspNetUsers"("normalizedUserName");

-- CreateIndex
CREATE UNIQUE INDEX "AspNetUsers_email_key" ON "AspNetUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AspNetUsers_normalizedEmail_key" ON "AspNetUsers"("normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "AspNetRoles_name_key" ON "AspNetRoles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AspNetRoles_normalizedName_key" ON "AspNetRoles"("normalizedName");

-- CreateIndex
CREATE INDEX "AspNetUserRoles_roleId_idx" ON "AspNetUserRoles"("roleId");

-- CreateIndex
CREATE INDEX "AspNetUserClaims_userId_idx" ON "AspNetUserClaims"("userId");

-- CreateIndex
CREATE INDEX "AspNetRoleClaims_roleId_idx" ON "AspNetRoleClaims"("roleId");

-- CreateIndex
CREATE INDEX "AspNetUserLogins_userId_idx" ON "AspNetUserLogins"("userId");
