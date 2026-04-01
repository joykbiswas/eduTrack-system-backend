import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
// import { UserRoutes } from "../module/user/user.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { TeacherRoutes } from "../module/teacher/teacher.route";
import { StudentRoutes } from "../module/student/student.route";
import { OrganizationRoutes } from "../module/organization/organization.route";
import { ClassRoutes } from "../module/class/class.route";
import { LookupRoutes } from "../module/lookup/lookup.route";
import { WordStoryCardRoutes } from "../module/word-story-card/word-story-card.route";
import { MessageRoutes } from "../module/message/message.route";
import { TaskRoutes } from "../module/task/task.route";
import { QuizRoutes } from "../module/quiz/quiz.route";
import { CardContentRoutes } from "../module/card-content/card-content.route";
import { MaterialRoutes } from "../module/material/material.route";
import { AssessmentRoutes } from "../module/assessment/assessment.route";


const router = Router();

router.use("/auth", AuthRoutes);
// router.use("/users", UserRoutes);
router.use("/admin", AdminRoutes);
router.use("/teacher", TeacherRoutes);
router.use("/student", StudentRoutes);
router.use("/organizations", OrganizationRoutes);
router.use("/classes", ClassRoutes);
router.use("/lookups", LookupRoutes);
router.use("/word-story-cards", WordStoryCardRoutes);
router.use("/messages", MessageRoutes);
router.use("/tasks", TaskRoutes);
router.use("/quizzes", QuizRoutes);
router.use("/card-contents", CardContentRoutes);
router.use("/materials", MaterialRoutes);
router.use("/assessments", AssessmentRoutes);


export const IndexRoutes = router;
