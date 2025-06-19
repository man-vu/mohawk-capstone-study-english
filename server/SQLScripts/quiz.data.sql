-- ========== QUIZ SKILL ==========
SET IDENTITY_INSERT dbo.QuizSkill ON;
INSERT INTO dbo.QuizSkill (SkillId, SkillDescription) VALUES
    (1,'Listening'),
    (2,'Reading'),
    (3,'Writing'),
    (4,'Speaking'),
    (5,'Vocabulary'),
    (6,'Grammar');
SET IDENTITY_INSERT dbo.QuizSkill OFF;

-- ========== QUESTION TYPE ==========
SET IDENTITY_INSERT dbo.QuestionType ON;
INSERT INTO dbo.QuestionType (TypeId, TypeName) VALUES
    (1, 'Multiple Choice'),
    (2, 'Gap Filling'),
    (3, 'Matching'),
    (4, 'Essay');
SET IDENTITY_INSERT dbo.QuestionType OFF;

-- ========== QUESTION INSTRUCTION ==========
SET IDENTITY_INSERT dbo.QuestionInstruction ON;
INSERT INTO dbo.QuestionInstruction (InstructionId, Instruction) VALUES
    (1,'<b>Choose the correct answer.</b>'),
    (12,'<b>Complete the following sentences using the appropriate form of the word given in the brackets.</b>'),
    (10,'<b>Complete the text below, using the words in brackets in such a way that they fit the space grammatically.</b>'),
    (13,'<b>Complete the text with one word that best fits into each gap</b>'),
    (27,'<b>Select the correct answer(s).</b>'),
    (36,'Complete the question by selecting an appropriate option for each text on the left column.'),
    (21,'Complete the text with one word that best fits into each gap.'),
    (50,'Select the correct answer(s).'),
    (3,'Think of <b>one</b> word only which can be used appropriately in <b>all three sentences</b>.'),
    (14,'You are going to read an extract from an article about modern art and whether it can be called \''art\''. For questions <strong>1-10</strong>, choose from the people <strong>(A, B, C or D)</strong>. The people may be chosen more than once.');
SET IDENTITY_INSERT dbo.QuestionInstruction OFF;

-- ========== QUIZ ==========
SET IDENTITY_INSERT dbo.Quiz ON;
INSERT INTO dbo.Quiz (QuizId, Title, SkillId, Description, IsActive, TimeAllowed, CreatedBy, CreatedAt) VALUES
    (1,'CPE',5,'Exercises from ExamEnglish',1,30,1,'2021-05-30 16:42:55'),
    (2,'CPE',5,'Use of English Part 3',1,30,1,'2021-05-30 20:49:51'),
    (3,'CPE',6,'Objective Proficiency p.11',1,30,1,'2021-05-30 21:44:28'),
    (4,'CPE',5,'1000 Word Formation - Part 1',1,30,1,'2021-05-31 03:34:39'),
    (5,'Gifted Students',2,'Open Cloze Exercises',1,60,1,'2021-05-31 04:05:27'),
    (6,'CPE',2,'Reading part 7',1,30,1,'2021-06-03 23:16:29'),
    (7,'CPE',5,'Objective Proficiency Practice Tests',1,45,1,'2021-06-08 03:30:33'),
    (8,'CPE',5,'CPE Practice Test 1',1,60,1,'2021-06-08 04:39:53'),
    (9,'CPE',2,'CPE Practice Test 2',1,75,1,'2021-06-08 04:43:23'),
    (10,'CPE',6,'CPE Practice Test 3',1,30,1,'2021-06-08 04:43:38'),
    (11,'CPE',5,'CPE Practice Test 4',1,45,1,'2021-06-08 04:44:38'),
    (12,'CPE',1,'CPE Practice Test 5',1,60,1,'2021-06-08 04:45:02'),
    (13,'CPE',4,'CPE Practice Test 6',1,30,1,'2021-06-08 04:45:16'),
    (15,'IELTS',3,'IELTS Writing Task 2',1,60,1,'2021-06-09 02:27:09'),
    (16,'IELTS 101',2,'Traveling',1,60,1,'2021-06-10 12:54:02');
SET IDENTITY_INSERT dbo.Quiz OFF;

-- ========== QUIZ PART ==========
SET IDENTITY_INSERT dbo.QuizPart ON;
INSERT INTO dbo.QuizPart (PartId, QuizId, PartTitle, SortOrder) VALUES
    (1,1,'Part 1',1),
    (2,1,'Part 2',2);
SET IDENTITY_INSERT dbo.QuizPart OFF;

-- ========== SAMPLE QUESTIONS (add more as needed) ==========
SET IDENTITY_INSERT dbo.Question ON;
INSERT INTO dbo.Question (QuestionId, TypeId, InstructionId, IsActive, ParagraphTitle, QuestionText, CreatedAt) VALUES
    (1,1,1,1,NULL,'I felt an _______ with the writer from his descriptions of a world that seemed to have a great deal in common with my own.','2021-05-30 16:42:55'),
    (2,2,21,1,NULL,'The Eiffel Tower is located in ______ and was completed in ______.','2021-05-30 16:45:00'),
    (3,3,36,1,NULL,'Match each country with its capital city.','2021-05-30 16:46:00'),
    (4,3,36,1,NULL,'Match each science field with its definition.','2021-05-30 16:47:00'),
    (5,3,36,1,NULL,'Match each author with their famous work.','2021-05-30 16:48:00'),
    (6,2,13,1,NULL,'______ is known as the Red Planet.','2021-05-30 16:49:00'),
    (7,3,36,1,NULL,'Match each animal with its typical sound.','2021-05-30 16:50:00');
SET IDENTITY_INSERT dbo.Question OFF;

-- ========== QUESTION MULTIPLE CHOICE (sample only) ==========
INSERT INTO dbo.QuestionMultipleChoice (QuestionId, ChoiceText, ChoiceOrder, IsCorrect) VALUES
    (1,'affection',1,0),
    (1,'identification',2,1),
    (1,'preference',3,0),
    (1,'tolerance',4,0);

-- ========== QUESTION GAP FILLING ==========
INSERT INTO dbo.QuestionGapFilling (QuestionId, SequenceId, CorrectAnswer) VALUES
    (2,1,'Paris'),
    (2,2,'1889'),
    (6,1,'Mars');

-- ========== QUESTION MATCHING PAIRS ==========
INSERT INTO dbo.MatchingPrompt (QuestionId, LeftText, PromptOrder) VALUES
    (3,'France',1),
    (3,'Japan',2),
    (4,'Physics',1),
    (4,'Chemistry',2),
    (4,'Biology',3),
    (5,'Shakespeare',1),
    (5,'Homer',2),
    (5,'J.K. Rowling',3),
    (7,'Dog',1),
    (7,'Cat',2),
    (7,'Cow',3);
INSERT INTO dbo.MatchingChoice (QuestionId, RightText, ChoiceOrder) VALUES
    (3,'Paris',1),
    (3,'Tokyo',2),
    (4,'Study of matter and energy',1),
    (4,'Study of substances and their reactions',2),
    (4,'Study of living organisms',3),
    (5,'Hamlet',1),
    (5,'The Odyssey',2),
    (5,'Harry Potter',3),
    (7,'Bark',1),
    (7,'Meow',2),
    (7,'Moo',3);

INSERT INTO dbo.MatchingAnswer (PromptId, ChoiceId) VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4),
    (5,5),
    (6,6),
    (7,7),
    (8,8),
    (9,9),
    (10,10),
    (11,11);

-- ========== QUIZ QUESTION ==========
INSERT INTO dbo.QuizQuestion (QuizId, QuestionId, PartId, SortOrder) VALUES
    (1,1,1,1),
    (1,2,1,2),
    (1,3,2,3),
    (1,4,2,4),
    (1,5,2,5),
    (1,6,1,6),
    (1,7,2,7);