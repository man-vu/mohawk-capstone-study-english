const prisma = require('./prismaClient')

async function getAllQuizzes() {
  return prisma.quiz.findMany({
    include: { Skill: true }
  })
}

async function getQuizById(id) {
  return prisma.quiz.findUnique({
    where: { QuizId: id },
    include: {
      Skill: true,
      QuizQuestion: {
        include: {
          Question: true
        }
      }
    }
  })
}

async function createQuiz(data) {
  return prisma.quiz.create({ data })
}

async function updateQuiz(id, data) {
  return prisma.quiz.update({
    where: { QuizId: id },
    data
  })
}

async function deleteQuiz(id) {
  return prisma.quiz.delete({ where: { QuizId: id } })
}

async function createUser(data) {
  return prisma.appUser.create({ data })
}

async function findUserByEmail(email) {
  return prisma.appUser.findUnique({ where: { Email: email } })
}

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createUser,
  findUserByEmail
}
