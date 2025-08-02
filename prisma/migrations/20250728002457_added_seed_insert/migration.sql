-- DropIndex
DROP INDEX `Email_user_id_fkey` ON `email`;

-- DropIndex
DROP INDEX `UserPlan_plan_id_fkey` ON `userplan`;

-- DropIndex
DROP INDEX `UserPlan_user_id_fkey` ON `userplan`;

-- AddForeignKey
ALTER TABLE `Email` ADD CONSTRAINT `Email_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPlan` ADD CONSTRAINT `UserPlan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPlan` ADD CONSTRAINT `UserPlan_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `Plan`(`plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;
