-- AlterTable
ALTER TABLE `post` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `content` VARCHAR(191) NULL,
    MODIFY `date` DATETIME(3) NULL,
    MODIFY `jalaliDate` VARCHAR(191) NULL,
    MODIFY `score` INTEGER NULL,
    MODIFY `category` VARCHAR(191) NULL,
    MODIFY `postThumbnail` VARCHAR(191) NULL DEFAULT '';
