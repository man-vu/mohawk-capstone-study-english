import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';
export interface Question {
  QuestionId: number;
  TypeId: number;
  InstructionId: number;
  IsActive: boolean;
  ParagraphTitle: string;
  QuestionText: string;
  CreatedAt: Date;
}

export class QuestionModel {
  static create(data: Prisma.QuestionCreateInput) {
    return prisma.question.create({ data });
  }

  static findById(QuestionId: number) {
    return prisma.question.findUnique({ where: { QuestionId } });
  }

  static update(QuestionId: number, data: Prisma.QuestionUpdateInput) {
    return prisma.question.update({ where: { QuestionId }, data });
  }

  static delete(QuestionId: number) {
    return prisma.question.delete({ where: { QuestionId } });
  }

  static findAll() {
    return prisma.question.findMany();
  }

  static async findManyByQuizId({ quizId, userId, attemptId }: { quizId: number; userId?: number; attemptId?: number }) {
    if (attemptId && userId) {
      const questions = await prisma.question.findMany({
        where: { IsActive: true, QuizQuestion: { some: { QuizId: quizId } } },
        include: {
          QuestionInstruction: true,
          QuestionType: true,
          UserAnswer: { where: { AttemptId: attemptId } },
          QuizQuestion: { where: { QuizId: quizId }, select: { PartId: true, SortOrder: true } },
        },
        orderBy: { QuizQuestion: { SortOrder: 'asc' } },
      });
      return questions.map((q) => ({
        question_id: q.QuestionId,
        type_id: q.TypeId,
        type_name: q.QuestionType.TypeName,
        is_active: q.IsActive,
        paragraph_title: q.ParagraphTitle,
        question: q.QuestionText,
        instruction: q.QuestionInstruction.Instruction,
        answer_text: q.UserAnswer[0]?.AnswerText ?? '',
        part_id: q.QuizQuestion[0]?.PartId ?? null,
      }));
    }

    const questions = await prisma.question.findMany({
      where: { IsActive: true, QuizQuestion: { some: { QuizId: quizId } } },
      include: {
        QuestionInstruction: true,
        QuestionType: true,
        QuizQuestion: { where: { QuizId: quizId }, select: { PartId: true, SortOrder: true } },
      },
      orderBy: { QuizQuestion: { SortOrder: 'asc' } },
    });
    return questions.map((q) => ({
      question_id: q.QuestionId,
      type_id: q.TypeId,
      type_name: q.QuestionType.TypeName,
      is_active: q.IsActive,
      paragraph_title: q.ParagraphTitle,
      question: q.QuestionText,
      instruction: q.QuestionInstruction.Instruction,
      part_id: q.QuizQuestion[0]?.PartId ?? null,
    }));
  }

  static async loadContent(quizId: number) {
    const questions = await prisma.question.findMany({
      where: { IsActive: true, QuizQuestion: { some: { QuizId: quizId } } },
      include: {
        QuestionMultipleChoice: true,
        QuestionGapFilling: true,
        MatchingPrompt: true,
        MatchingChoice: true,
        QuizQuestion: { where: { QuizId: quizId }, select: { PartId: true, SortOrder: true } },
      },
      orderBy: { QuizQuestion: { SortOrder: 'asc' } },
    });

    const result: any[] = [];
    for (const q of questions) {
      q.QuestionMultipleChoice.forEach((c) =>
        result.push({
          question_id: q.QuestionId,
          choice_id: c.ChoiceOrder,
          choice_text: c.ChoiceText,
          is_correct_choice: c.IsCorrect,
        })
      );
      q.QuestionGapFilling.forEach((g) =>
        result.push({
          question_id: q.QuestionId,
          sequence_id: g.SequenceId,
          correct_answer: g.CorrectAnswer,
        })
      );
      q.MatchingPrompt.forEach((p) =>
        result.push({
          question_id: q.QuestionId,
          prompt_order: p.PromptOrder,
          left_text: p.LeftText,
        })
      );
      q.MatchingChoice.forEach((c2) =>
        result.push({
          question_id: q.QuestionId,
          choice_order: c2.ChoiceOrder,
          right_text: c2.RightText,
        })
      );
    }
    return result;
  }

  static async findManyByQuizIdForEdit(quizId: number) {
    const questions = await prisma.question.findMany({
      where: { QuizQuestion: { some: { QuizId: quizId } } },
      include: { QuestionInstruction: true, QuestionType: true },
      orderBy: { QuestionId: 'asc' },
    });
    return questions.map((q) => ({
      question_id: q.QuestionId,
      type_id: q.TypeId,
      type_name: q.QuestionType.TypeName,
      is_active: q.IsActive,
      paragraph_title: q.ParagraphTitle,
      question: q.QuestionText,
      instruction: q.QuestionInstruction.Instruction,
    }));
  }

  static async findOneForEdit(questionId: number) {
    const q = await prisma.question.findUnique({
      where: { QuestionId: questionId },
      include: {
        QuestionInstruction: true,
        QuestionType: true,
      },
    });
    if (!q) return null;
    return {
      question_id: q.QuestionId,
      type_id: q.TypeId,
      type_name: q.QuestionType.TypeName,
      is_active: q.IsActive,
      paragraph_title: q.ParagraphTitle,
      question: q.QuestionText,
      instruction: q.QuestionInstruction.Instruction,
    } as any;
  }

  static async saveOne({
    typeId,
    questionId,
    instructionId,
    isActive,
    paragraphTitle,
    question,
  }: {
    typeId: number;
    questionId: number;
    instructionId: number;
    isActive: number | boolean;
    paragraphTitle?: string;
    question: string;
  }) {
    return prisma.question.update({
      where: { QuestionId: questionId },
      data: {
        TypeId: typeId,
        InstructionId: instructionId,
        IsActive: !!isActive,
        ParagraphTitle: paragraphTitle ?? null,
        QuestionText: question,
      },
    });
  }
}
export default QuestionModel;
