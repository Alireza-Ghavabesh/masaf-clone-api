-- AlterTable
ALTER TABLE `post` ADD COLUMN `jadidtarinSokhanraniHaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `siteContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bannerUrl` VARCHAR(191) NOT NULL,
    `smallBannerLeftUrl` VARCHAR(191) NOT NULL,
    `smallBannerMidUrl` VARCHAR(191) NOT NULL,
    `smallBannerRighttUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadidtarinSokhanraniHa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_jadidtarinSokhanraniHaId_fkey` FOREIGN KEY (`jadidtarinSokhanraniHaId`) REFERENCES `JadidtarinSokhanraniHa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
