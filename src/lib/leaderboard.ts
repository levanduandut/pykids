import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  classMembers,
  exercises,
  submissions,
  users,
} from "@/lib/db/schema";
import type { LeaderboardRow } from "@/components/leaderboard";

export async function computeLeaderboard(classId: string): Promise<{
  rows: LeaderboardRow[];
  totalExercises: number;
}> {
  const [classExercises, members] = await Promise.all([
    db
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.classId, classId)),
    db
      .select({
        id: users.id,
        fullName: users.fullName,
      })
      .from(classMembers)
      .innerJoin(users, eq(users.id, classMembers.studentId))
      .where(eq(classMembers.classId, classId)),
  ]);

  const totalExercises = classExercises.length;
  if (totalExercises === 0 || members.length === 0) {
    return { rows: [], totalExercises };
  }

  const exerciseIds = classExercises.map((e) => e.id);
  const studentIds = members.map((m) => m.id);

  const allSubs = await db
    .select({
      exerciseId: submissions.exerciseId,
      studentId: submissions.studentId,
      score: submissions.score,
      durationSeconds: submissions.durationSeconds,
    })
    .from(submissions)
    .where(
      and(
        inArray(submissions.exerciseId, exerciseIds),
        inArray(submissions.studentId, studentIds),
      ),
    );

  type Agg = {
    bestByEx: Map<string, number>;
    duration: number;
  };
  const byStudent = new Map<string, Agg>();
  for (const s of allSubs) {
    let a = byStudent.get(s.studentId);
    if (!a) {
      a = { bestByEx: new Map(), duration: 0 };
      byStudent.set(s.studentId, a);
    }
    const cur = a.bestByEx.get(s.exerciseId) ?? -1;
    if (s.score > cur) a.bestByEx.set(s.exerciseId, s.score);
    a.duration += s.durationSeconds;
  }

  const rows: LeaderboardRow[] = members.map((m) => {
    const a = byStudent.get(m.id);
    if (!a) {
      return {
        studentId: m.id,
        studentName: m.fullName,
        totalPoints: 0,
        exercisesDone: 0,
        totalDurationSeconds: 0,
        perfectCount: 0,
      };
    }
    let totalPoints = 0;
    let perfectCount = 0;
    for (const score of a.bestByEx.values()) {
      totalPoints += score;
      if (score === 100) perfectCount += 1;
    }
    return {
      studentId: m.id,
      studentName: m.fullName,
      totalPoints,
      exercisesDone: a.bestByEx.size,
      totalDurationSeconds: a.duration,
      perfectCount,
    };
  });

  rows.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.perfectCount !== a.perfectCount)
      return b.perfectCount - a.perfectCount;
    return a.totalDurationSeconds - b.totalDurationSeconds;
  });

  return { rows, totalExercises };
}
