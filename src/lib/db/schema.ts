import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["teacher", "student"]);
export const difficultyEnum = pgEnum("difficulty", ["cap1", "cap2"]);
export const testTypeEnum = pgEnum("test_type", [
  "stdin_stdout",
  "function_check",
  "custom_script",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").notNull(),
  gradeLevel: integer("grade_level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  gradeLevel: integer("grade_level").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classMembers = pgTable(
  "class_members",
  {
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.classId, t.studentId] })],
);

export const exercises = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  starterCode: text("starter_code").default("").notNull(),
  solutionCode: text("solution_code").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testCases = pgTable("test_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  type: testTypeEnum("type").notNull(),
  input: text("input").default("").notNull(),
  expectedOutput: text("expected_output").default("").notNull(),
  hidden: boolean("hidden").default(false).notNull(),
  weight: integer("weight").default(1).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  exerciseId: uuid("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  score: integer("score").notNull(),
  passedCount: integer("passed_count").notNull(),
  totalCount: integer("total_count").notNull(),
  results: jsonb("results").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  classesTaught: many(classes),
  memberships: many(classMembers),
  submissions: many(submissions),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  members: many(classMembers),
  exercises: many(exercises),
}));

export const classMembersRelations = relations(classMembers, ({ one }) => ({
  class: one(classes, {
    fields: [classMembers.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [classMembers.studentId],
    references: [users.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  class: one(classes, {
    fields: [exercises.classId],
    references: [classes.id],
  }),
  testCases: many(testCases),
  submissions: many(submissions),
}));

export const testCasesRelations = relations(testCases, ({ one }) => ({
  exercise: one(exercises, {
    fields: [testCases.exerciseId],
    references: [exercises.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  exercise: one(exercises, {
    fields: [submissions.exerciseId],
    references: [exercises.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type TestCase = typeof testCases.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
