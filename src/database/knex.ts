import knex from "knex";

export default knex({
  client: "mysql",
  connection: {
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    user: process.env.USER,
  },
});

// CREATE TABLE `permissions` (
// 	`role_discord_id` VARCHAR(50) NOT NULL,
// 	PRIMARY KEY (`role_discord_id`)
// )
// COLLATE='utf16_general_ci'
// ;
// CREATE TABLE `channels` (
// 	`channel_discord_id` VARCHAR(50) NOT NULL,
// 	PRIMARY KEY (`channel_discord_id`)
// )
// COLLATE='utf16_general_ci'
// ;
// CREATE TABLE `questions` (
// 	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
// 	`message` TEXT NOT NULL,
// 	`author_discord_id` VARCHAR(50) NOT NULL DEFAULT '',
// 	`created_at` DATETIME NOT NULL DEFAULT NOW(),
// 	UNIQUE INDEX `message` (`message`),
// 	PRIMARY KEY (`id`)
// )
// COLLATE='utf16_general_ci'
// ;
// CREATE TABLE `answers` (
// 	`id` INT NOT NULL AUTO_INCREMENT,
// 	`message` TEXT NOT NULL,
// 	`question_id` INT UNSIGNED NOT NULL,
// 	`author_discord_id` VARCHAR(50) NOT NULL,
// 	`created_at` DATETIME NOT NULL,
// 	PRIMARY KEY (`id`),
// 	UNIQUE INDEX `message_question_id` (`message`, `question_id`),
// 	CONSTRAINT `FK__questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
// )
// COLLATE='utf16_general_ci'
// ;