-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "word_story_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
