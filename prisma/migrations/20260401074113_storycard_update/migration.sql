-- AlterTable
ALTER TABLE "word_story_cards" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "word_story_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
