# TODO.md - Main Tasks

## Primary: Word-Story-Card Student Integration (0/12 steps)
[Existing list unchanged...]

## Secondary: Enhance analysis.md API Docs with RequestBody/Response (Parallel)
- See TODO-Add-RequestResponse.md for steps.
- Status: Started (plan approved).


## Status: 0/12 steps completed

1. [x] Create this TODO.md file.

2. [x] Update analysis.md with integration plan section, STUDENT endpoints table, flow diagram (text), payloads.

3. [x] src/app/module/word-story-card/word-story-card.service.ts: Add `getPublishedCards` function - filter status='PUBLISHED', isDeleted=false, include relations.

4. [ ] src/app/module/word-story-card/word-story-card.controller.ts: Add `getPublishedCards` handler.

5. [ ] src/app/module/word-story-card/word-story-card.route.ts: 
   - Edit GET '/', GET '/:id' middleware to `checkAuth(Role.TEACHER, Role.STUDENT)`
   - Add GET '/published', checkAuth(Role.STUDENT)

6. [ ] src/app/module/student/student.service.ts: Add 
   - `getHomeWordStoryCards()` → WordStoryCardService.getPublishedCards()
   - `submitCardAnswer(studentId: string, cardId: string, answers: any)` → create/update response (JSON field)

7. [ ] src/app/module/student/student.controller.ts: Add handlers `getHomeWordStoryCards`, `submitCardAnswer`.

8. [ ] src/app/module/student/student.route.ts: Add 
   - GET '/word-story-cards' STUDENT auth
   - POST '/word-story-cards/:cardId/submit-answer' STUDENT auth + validation

9. [ ] Prisma schema update: Add `model WordStoryCardResponse { id String @id @default(uuid()) studentId String @map("student_id") cardId String @map("card_id") answers Json? submittedAt DateTime @default(now()) student User @relation(fields: [studentId], references: [id]) card WordStoryCard @relation(fields: [cardId], references: [id]) }` then `prisma generate` + migrate.

10. [ ] Seed published cards in src/app/utils/seed.ts.

11. [ ] Test endpoints, update TODO.md mark complete.

12. [ ] Update analysis.md final endpoints, attempt_completion.

**Notes:** Mark [x] when step complete. Update progress after each.

