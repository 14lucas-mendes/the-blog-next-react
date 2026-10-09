ALTER TABLE `posts` ADD `content` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE INDEX `posts_published_created_at_idx` ON `posts` (`published`, `created_at`, `id`);

