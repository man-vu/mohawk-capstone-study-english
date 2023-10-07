const database = new (require("../config/database"))();

class AnswerModel {
  constructor() {
    this.db = database;
  }

  async findMany(questionId) {
    return await this.db.executeQuery(`SELECT qms.subquestion_id, qms.letter, qms.text, qms.column_assigned
    FROM question q
    JOIN question_matching_sub qms ON q.question_id = qms.question_id
    WHERE q.question_id = ${questionId}`)
  }

  async addQuestion(questionId, correctAnswers, shuffleAnswers) {
    return await this.db.executeQuery(`INSERT INTO question_matching (question_id, correct_answers, shuffle_answers) 
    VALUES ('${correctAnswers}', '${questionId}', '${shuffleAnswers}')`)
  }

  async addMany(leftItems, rightItems, questionId) {
    let query = `INSERT INTO question_matching_sub (subquestion_id, question_id, text, letter, column_assigned) VALUES `;

    for (let i = 0; i < leftItems.length; i++) {
      query = query.concat(
        `('${i + 1}', ${questionId}, '${leftItems[i].item}', '${
          leftItems[i].letter
        }', '1'), `
      );
    }

    for (let i = 0; i < rightItems.length; i++) {
      query = query.concat(
        `('${i + 1}', ${questionId}, '${rightItems[i].item}', '${
          rightItems[i].letter
        }', '2'), `
      );
    }

    let formattedQuery = query.substring(0, query.length - 2);

    console.log(formattedQuery);

    return await this.db.executeQuery(formattedQuery)
  }

  async saveMany(items, questionId) {
    let query = ''
    for (const { subquestion_id, text, item, letter, column_assigned} of items) {
      query += `UPDATE question_matching_sub 
      SET letter = '${letter}', text = '${item ? item : text}'
      WHERE subquestion_id = ${subquestion_id} AND question_id = ${questionId} AND column_assigned = ${column_assigned};`;
    }
    
    return await this.db.executeQuery(query)
  }

  async saveMatchingQuestion(correctAnswers, questionId) {
    return await this.db.executeQuery(`UPDATE question_matching 
    SET correct_answers = '${correctAnswers}'
    WHERE question_id = ${questionId}`)
  }
}

module.exports = AnswerModel;
