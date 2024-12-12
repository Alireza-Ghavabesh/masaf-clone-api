/*
  Warnings:

  - Added the required column `footerBannerUrl` to the `siteContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `bargozideVahedHaId` INTEGER NULL,
    ADD COLUMN `jadidtarinClipiHaId` INTEGER NULL,
    ADD COLUMN `jadidtarinFaaliatHayeOstad` INTEGER NULL;

-- AlterTable
ALTER TABLE `sitecontent` ADD COLUMN `footerBannerUrl` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `JadidtarinClipiHa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BargozideVahedHa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadidtarinFaaliatHayeOstad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_jadidtarinClipiHaId_fkey` FOREIGN KEY (`jadidtarinClipiHaId`) REFERENCES `JadidtarinClipiHa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_bargozideVahedHaId_fkey` FOREIGN KEY (`bargozideVahedHaId`) REFERENCES `BargozideVahedHa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_jadidtarinFaaliatHayeOstad_fkey` FOREIGN KEY (`jadidtarinFaaliatHayeOstad`) REFERENCES `JadidtarinFaaliatHayeOstad`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
