# TODO: Add Image Field to WordStoryCard

## Steps to Complete:

### 1. ✅ Update Prisma Schema
Edit `prisma/schema/education.prisma` - Add `image String?` to WordStoryCard model

### 2. ✅ Update TypeScript Interface  
Edit `src/app/module/word-story-card/word-story-card.interface.ts` - Add `image?: string;` to IWordStoryCardPayload

### 3. ✅ Database Migration
Run: `npx prisma migrate dev --name add-image-to-wordstorycard`

### 4. [ ] Generate Prisma Client
Run: `npx prisma generate`

### 5. [ ] Test API Endpoint
Test POST /word-story-card with image field

### 6. [ ] Mark Complete
Update this TODO.md ✅
