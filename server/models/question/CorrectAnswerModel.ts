import prisma from '../../prismaClient';

export class CorrectAnswerModel {
  static async findMultipleChoice(quizId: number) {
    const questions = await prisma.question.findMany({
      where: {
        IsActive: true,
        TypeId: 1,
        QuizQuestion: { some: { QuizId: quizId } },
      },
      include: {
        QuestionMultipleChoice: {
          orderBy: { ChoiceOrder: 'asc' },
          select: { ChoiceOrder: true, IsCorrect: true },
        },
      },
      orderBy: { QuestionId: 'asc' },
    });

    const result: any[] = [];
    for (const q of questions) {
      for (const c of q.QuestionMultipleChoice) {
        result.push({
          question_id: q.QuestionId,
          choice_id: c.ChoiceOrder,
          is_correct_choice: c.IsCorrect,
        });
      }
    }
    return result;
  }

  static async findGapFilling(quizId: number) {
    const questions = await prisma.question.findMany({
      where: {
        IsActive: true,
        TypeId: 2,
        QuizQuestion: { some: { QuizId: quizId } },
      },
      include: {
        QuestionGapFilling: {
          orderBy: { SequenceId: 'asc' },
          select: { SequenceId: true, CorrectAnswer: true },
        },
      },
      orderBy: { QuestionId: 'asc' },
    });

    const result: any[] = [];
    for (const q of questions) {
      for (const g of q.QuestionGapFilling) {
        result.push({
          question_id: q.QuestionId,
          sequence_id: g.SequenceId,
          correct_answer: g.CorrectAnswer,
        });
      }
    }
    return result;
  }

  static async findMatchingPairs(quizId: number) {
    const pairs = await prisma.matchingAnswer.findMany({
      where: {
        MatchingPrompt: {
          Question: {
            IsActive: true,
            TypeId: 3,
            QuizQuestion: { some: { QuizId: quizId } },
          },
        },
      },
      include: {
        MatchingPrompt: { select: { QuestionId: true, PromptOrder: true } },
        MatchingChoice: { select: { ChoiceOrder: true } },
      },
      orderBy: [
        { MatchingPrompt: { QuestionId: 'asc' } },
        { MatchingPrompt: { PromptOrder: 'asc' } },
        { MatchingChoice: { ChoiceOrder: 'asc' } },
      ],
    });

    return pairs.map((p) => ({
      question_id: p.MatchingPrompt.QuestionId,
      prompt_order: p.MatchingPrompt.PromptOrder,
      choice_order: p.MatchingChoice.ChoiceOrder,
      is_correct_choice: true,
    }));
  }
}
export default CorrectAnswerModel;
