USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'QuizVerse')
BEGIN
    PRINT 'Database QuizVerse already exists. Resetting...';
    EXEC sp_executesql N'ALTER DATABASE QuizVerse SET SINGLE_USER WITH ROLLBACK IMMEDIATE;';
    EXEC sp_executesql N'DROP DATABASE QuizVerse;';
END

PRINT 'Creating database QuizVerse...';
EXEC sp_executesql N'CREATE DATABASE QuizVerse;';
GO
USE QuizVerse;
GO

-- ========== START OF TABLE DEFINITIONS ==========

-- Roles and Permissions
CREATE TABLE dbo.Role (
    RoleId INT IDENTITY PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.Permission (
    PermissionId INT IDENTITY PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.RolePermission (
    RoleId INT NOT NULL,
    PermissionId INT NOT NULL,
    Enabled BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_RolePermission PRIMARY KEY (RoleId, PermissionId),
    CONSTRAINT FK_RolePermission_Role FOREIGN KEY (RoleId) REFERENCES dbo.Role(RoleId) ON DELETE CASCADE,
    CONSTRAINT FK_RolePermission_Permission FOREIGN KEY (PermissionId) REFERENCES dbo.Permission(PermissionId) ON DELETE CASCADE
);

CREATE TABLE MimeType (
    MimeId INT IDENTITY PRIMARY KEY,
    ImageUrl NVARCHAR(255) NOT NULL UNIQUE,
    ImageAlt NVARCHAR(255) NULL
);

-- Users
CREATE TABLE dbo.AppUser (
    UserId INT IDENTITY PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(200) NULL,
    PasswordSalt NVARCHAR(200) NULL,
    Gender CHAR(1) NOT NULL DEFAULT 'U',
    RoleId INT NOT NULL,
    ProfilePictureId INT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    FirstName NVARCHAR(45) NULL,
    LastName NVARCHAR(45) NULL,
    PasswordResetHash NVARCHAR(200) NULL,
    PasswordResetSalt NVARCHAR(200) NULL,
    PasswordResetExpiry DATETIME2 NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleId) REFERENCES dbo.Role(RoleId),
    CONSTRAINT FK_User_ProfilePic FOREIGN KEY (ProfilePictureId) REFERENCES dbo.MimeType(MimeId)
);

-- Quiz, Skill, and Instructions
CREATE TABLE dbo.QuizSkill (
    SkillId INT IDENTITY PRIMARY KEY,
    SkillDescription NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.Quiz (
    QuizId INT IDENTITY PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    SkillId INT NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    TimeAllowed INT NOT NULL DEFAULT 60, -- minutes
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Quiz_Skill FOREIGN KEY (SkillId) REFERENCES dbo.QuizSkill(SkillId),
    CONSTRAINT FK_Quiz_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.AppUser(UserId)
);

CREATE TABLE dbo.QuizPart (
    PartId INT IDENTITY PRIMARY KEY,
    QuizId INT NOT NULL,
    PartTitle NVARCHAR(100) NOT NULL,
    SortOrder INT NOT NULL,
    CONSTRAINT FK_QuizPart_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId) ON DELETE CASCADE
);

CREATE TABLE dbo.QuestionType (
    TypeId INT IDENTITY PRIMARY KEY,
    TypeName NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.QuestionInstruction (
    InstructionId INT IDENTITY PRIMARY KEY,
    Instruction NVARCHAR(255) NOT NULL UNIQUE
);

-- Questions and Subtypes
CREATE TABLE dbo.Question (
    QuestionId INT IDENTITY PRIMARY KEY,
    TypeId INT NOT NULL,
    InstructionId INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    ParagraphTitle NVARCHAR(100) NULL,
    QuestionText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Question_Type FOREIGN KEY (TypeId) REFERENCES dbo.QuestionType(TypeId),
    CONSTRAINT FK_Question_Instruction FOREIGN KEY (InstructionId) REFERENCES dbo.QuestionInstruction(InstructionId)
);

-- Prompts (left-side for matching questions)
CREATE TABLE dbo.MatchingPrompt (
    PromptId INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    LeftText NVARCHAR(255) NOT NULL,
    PromptOrder INT NOT NULL,
    CONSTRAINT FK_MatchingPrompt_Question FOREIGN KEY (QuestionId)
        REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

-- Choices (right-side for matching questions)
CREATE TABLE dbo.MatchingChoice (
    ChoiceId INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    RightText NVARCHAR(255) NOT NULL,
    ChoiceOrder INT NOT NULL,
    CONSTRAINT FK_MatchingChoice_Question FOREIGN KEY (QuestionId)
        REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

-- Correct answers: which prompt can match which choice (many-to-many)
CREATE TABLE dbo.MatchingAnswer (
    PromptId INT NOT NULL,
    ChoiceId INT NOT NULL,
    PRIMARY KEY (PromptId, ChoiceId),
    CONSTRAINT FK_MatchingAnswer_Prompt FOREIGN KEY (PromptId)
        REFERENCES dbo.MatchingPrompt(PromptId) ON DELETE CASCADE,
    CONSTRAINT FK_MatchingAnswer_Choice FOREIGN KEY (ChoiceId)
        REFERENCES dbo.MatchingChoice(ChoiceId) -- NO ACTION
);

-- (Optional) User-submitted matching answers
CREATE TABLE dbo.MatchingUserAnswer (
    UserAnswerId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    QuestionId INT NOT NULL,
    PromptId INT NOT NULL,
    SelectedChoiceId INT NOT NULL,
    AnsweredAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MatchingUserAnswer_Question FOREIGN KEY (QuestionId)
        REFERENCES dbo.Question(QuestionId), -- No ON DELETE CASCADE
    CONSTRAINT FK_MatchingUserAnswer_Prompt FOREIGN KEY (PromptId)
        REFERENCES dbo.MatchingPrompt(PromptId) ON DELETE CASCADE, -- Only cascade here (or to choice if you prefer)
    CONSTRAINT FK_MatchingUserAnswer_Choice FOREIGN KEY (SelectedChoiceId)
        REFERENCES dbo.MatchingChoice(ChoiceId) -- No ON DELETE CASCADE
    -- You may want to add a FK for UserId if you have a user/attempts table
);


-- Many-to-many: Quiz/Questions
CREATE TABLE dbo.QuizQuestion (
    QuizId INT NOT NULL,
    QuestionId INT NOT NULL,
    PartId INT NOT NULL,
    SortOrder INT NULL,
    PRIMARY KEY (QuizId, QuestionId),
    CONSTRAINT FK_QuizQuestion_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId) ON DELETE CASCADE,
    CONSTRAINT FK_QuizQuestion_Question FOREIGN KEY (QuestionId) REFERENCES dbo.Question(QuestionId), -- NO ACTION
    CONSTRAINT FK_QuizQuestion_Part FOREIGN KEY (PartId) REFERENCES dbo.QuizPart(PartId)
);

-- Subtype tables for questions
CREATE TABLE dbo.QuestionMultipleChoice (
    QMCId INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    ChoiceText NVARCHAR(128) NOT NULL,
    ChoiceOrder INT NOT NULL,
    IsCorrect BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_QMC_Question FOREIGN KEY (QuestionId) REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

CREATE TABLE dbo.QuestionGapFilling (
    QGFId INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    SequenceId INT NOT NULL,
    CorrectAnswer NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_QGF_Question FOREIGN KEY (QuestionId) REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

CREATE TABLE dbo.QuestionEssay (
    QuestionId INT PRIMARY KEY,        -- Inherits from Question
    WordLimit INT NULL,                -- e.g., 250
    SuggestedTimeMinutes INT NULL,     -- e.g., 40
    ModelAnswer NVARCHAR(MAX) NULL,    -- Optional: For instructor review/auto-grade
    CONSTRAINT FK_QuestionEssay_Question FOREIGN KEY (QuestionId)
        REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

-- User Attempts and Answers
CREATE TABLE dbo.UserAttempt (
    AttemptId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    QuizId INT NOT NULL,
    StartTime DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    EndTime DATETIME2 NULL,
    RemainingTime INT NULL,
    Grade DECIMAL(5,2) NULL,
    CONSTRAINT FK_UserAttempt_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserAttempt_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId) ON DELETE CASCADE
);

CREATE TABLE dbo.UserAnswer (
    UserAnswerId INT IDENTITY PRIMARY KEY,
    AttemptId INT NOT NULL,
    QuestionId INT NOT NULL,
    AnswerText NVARCHAR(1024) NULL, -- Short or summary for essay
    IsCorrect BIT NULL,
    CONSTRAINT FK_UserAnswer_Attempt FOREIGN KEY (AttemptId) REFERENCES dbo.UserAttempt(AttemptId), -- NO ACTION
    CONSTRAINT FK_UserAnswer_Question FOREIGN KEY (QuestionId) REFERENCES dbo.Question(QuestionId) ON DELETE CASCADE
);

CREATE TABLE dbo.UserEssayAnswer (
    UserAnswerId INT PRIMARY KEY,              -- Inherits from UserAnswer
    EssayText NVARCHAR(MAX) NOT NULL,          -- User's full essay
    Mark DECIMAL(5,2) NULL,                    -- Manual or auto-marked score
    TeacherFeedback NVARCHAR(MAX) NULL,        -- Teacher's feedback
    CONSTRAINT FK_UserEssayAnswer_UserAnswer FOREIGN KEY (UserAnswerId)
        REFERENCES dbo.UserAnswer(UserAnswerId) ON DELETE CASCADE
);

-- Favorites and Ratings
CREATE TABLE dbo.UserFavorite (
    UserId INT NOT NULL,
    QuizId INT NOT NULL,
    PRIMARY KEY (UserId, QuizId),
    CONSTRAINT FK_UserFavorite_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserFavorite_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId) ON DELETE CASCADE
);

CREATE TABLE dbo.UserRating (
    UserId INT NOT NULL,
    QuizId INT NOT NULL,
    RatingGiven TINYINT NOT NULL,
    PRIMARY KEY (UserId, QuizId),
    CONSTRAINT FK_UserRating_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserRating_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId) ON DELETE CASCADE
);

CREATE TABLE dbo.AppLog (
    LogId INT IDENTITY PRIMARY KEY,
    LogLevel NVARCHAR(20) NOT NULL, -- e.g. 'INFO', 'WARN', 'ERROR'
    LogMessage NVARCHAR(MAX) NOT NULL,
    UserId INT NULL,                -- Who triggered (if applicable)
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Source NVARCHAR(100) NULL,      -- e.g. 'QuizModule', 'Auth'
    CONSTRAINT FK_AppLog_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId)
);

CREATE TABLE dbo.AuditTrail (
    AuditId INT IDENTITY PRIMARY KEY,
    TableName NVARCHAR(100) NOT NULL,     -- E.g., 'Quiz', 'Question'
    RecordId INT NOT NULL,                -- The PK of the changed row
    Action NVARCHAR(20) NOT NULL,         -- 'INSERT', 'UPDATE', 'DELETE'
    UserId INT NULL,                      -- Who performed the action
    ChangeTimestamp DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    OldValues NVARCHAR(MAX) NULL,         -- For UPDATE/DELETE (JSON or XML)
    NewValues NVARCHAR(MAX) NULL,         -- For UPDATE/INSERT (JSON or XML)
    Context NVARCHAR(200) NULL            -- Optionally, e.g., 'BulkImport'
    -- You may want to use UNIQUEIDENTIFIER for RecordId for some tables
);

CREATE TABLE dbo.UserActivity (
    ActivityId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    ActivityType NVARCHAR(50) NOT NULL,   -- 'Login', 'Logout', 'QuizStart', etc.
    TargetId INT NULL,                    -- e.g., QuizId, QuestionId
    ActivityTime DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Details NVARCHAR(500) NULL,
    CONSTRAINT FK_UserActivity_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId)
);

-- ==================== NEW TABLES FOR VOCABULARY AND MOCK TESTS ====================

CREATE TABLE dbo.VocabularyWord (
    WordId INT IDENTITY PRIMARY KEY,
    Word NVARCHAR(100) NOT NULL UNIQUE,
    Definition NVARCHAR(500) NOT NULL,
    Example NVARCHAR(500) NULL,
    PartOfSpeech NVARCHAR(50) NULL,
    Level NVARCHAR(20) NULL,
    Category NVARCHAR(100) NULL,
    Difficulty NVARCHAR(20) NULL
);

CREATE TABLE dbo.UserVocabularyProgress (
    UserId INT NOT NULL,
    WordId INT NOT NULL,
    Mastery TINYINT NOT NULL DEFAULT 0,
    LastReviewed DATE NULL,
    CorrectStreak INT NOT NULL DEFAULT 0,
    Attempts INT NOT NULL DEFAULT 0,
    Memorized BIT NOT NULL DEFAULT 0,
    CONSTRAINT PK_UserVocabularyProgress PRIMARY KEY (UserId, WordId),
    CONSTRAINT FK_UserVocabularyProgress_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserVocabularyProgress_Word FOREIGN KEY (WordId) REFERENCES dbo.VocabularyWord(WordId) ON DELETE CASCADE
);

CREATE TABLE dbo.WordGroup (
    GroupId INT IDENTITY PRIMARY KEY,
    Theme NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);

CREATE TABLE dbo.VocabularyWordGroup (
    WordId INT NOT NULL,
    GroupId INT NOT NULL,
    PRIMARY KEY (WordId, GroupId),
    CONSTRAINT FK_VocabularyWordGroup_Word FOREIGN KEY (WordId) REFERENCES dbo.VocabularyWord(WordId) ON DELETE CASCADE,
    CONSTRAINT FK_VocabularyWordGroup_Group FOREIGN KEY (GroupId) REFERENCES dbo.WordGroup(GroupId) ON DELETE CASCADE
);

CREATE TABLE dbo.MockTest (
    MockTestId INT IDENTITY PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    TotalDuration INT NOT NULL, -- minutes
    CreatedBy INT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MockTest_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES dbo.AppUser(UserId)
);

CREATE TABLE dbo.MockTestSection (
    SectionId INT IDENTITY PRIMARY KEY,
    MockTestId INT NOT NULL,
    QuizId INT NULL,
    SkillId INT NOT NULL,
    Duration INT NOT NULL,
    TotalQuestions INT NOT NULL,
    SortOrder INT NOT NULL,
    CONSTRAINT FK_MockTestSection_MockTest FOREIGN KEY (MockTestId) REFERENCES dbo.MockTest(MockTestId) ON DELETE CASCADE,
    CONSTRAINT FK_MockTestSection_Quiz FOREIGN KEY (QuizId) REFERENCES dbo.Quiz(QuizId),
    CONSTRAINT FK_MockTestSection_Skill FOREIGN KEY (SkillId) REFERENCES dbo.QuizSkill(SkillId)
);

CREATE TABLE dbo.WritingAssessment (
    AssessmentId INT IDENTITY PRIMARY KEY,
    UserEssayAnswerId INT NOT NULL,
    TaskResponseScore DECIMAL(5,2) NULL,
    CoherenceCohesionScore DECIMAL(5,2) NULL,
    LexicalResourcesScore DECIMAL(5,2) NULL,
    GrammaticalAccuracyScore DECIMAL(5,2) NULL,
    OverallBand DECIMAL(5,2) NULL,
    EstimatedIELTSScore DECIMAL(5,2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_WritingAssessment_Essay FOREIGN KEY (UserEssayAnswerId) REFERENCES dbo.UserEssayAnswer(UserAnswerId) ON DELETE CASCADE
);

-- ========== END OF TABLE DEFINITIONS ==========

-- ========== START OF SEED DATA ==========
-- Ensure the database is ready for seeding

USE QuizVerse;
GO

-- ========== PERMISSION ==========
SET IDENTITY_INSERT dbo.Permission ON;
INSERT INTO dbo.Permission (PermissionId, PermissionName) VALUES
    (1, 'CAN_MANAGE_QUIZ'),
    (2, 'CAN_DO_QUIZ'),
    (3, 'CAN_CREATE_THREAD'),
    (4, 'CAN_REPLY_IN_THREAD'),
    (5, 'CAN_MANAGE_THREAD'),
    (6, 'CAN_MANAGE_POST'),
    (7, 'CAN_MAKE_FAVORITE_QUIZ'),
    (8, 'CAN_GIVE_RATING'),
    (9, 'CAN_VIEW_BOARD_STATISTICS'),
    (10, 'CAN_VIEW_USER_STATISTICS'),
    (11, 'CAN_FILTER_AND_SORT_QUIZZES');
SET IDENTITY_INSERT dbo.Permission OFF;

-- ========== ROLE ==========
SET IDENTITY_INSERT dbo.Role ON;
INSERT INTO dbo.Role (RoleId, RoleName) VALUES
    (1, 'teacher'),
    (2, 'student');
SET IDENTITY_INSERT dbo.Role OFF;

-- ========== ROLEPERMISSION ==========
INSERT INTO dbo.RolePermission (RoleId, PermissionId, Enabled) VALUES
    (2,1,0),(1,2,1),(2,2,1),(1,3,1),(2,3,1),(1,4,1),(2,4,1),(1,5,1),(2,5,0),
    (1,6,1),(2,6,0),(1,7,1),(2,7,1),(1,8,1),(2,8,1),(1,9,1),(2,9,0),
    (1,10,1),(2,10,1),(1,11,1),(2,11,1);

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

-- ========== APP USER ==========
SET IDENTITY_INSERT dbo.AppUser ON;
INSERT INTO dbo.AppUser (UserId, Email, PasswordHash, Gender, RoleId, FirstName, LastName, CreatedAt) VALUES
    (1,'drinvisible1997@gmail.com','$2b$10$bY2/bhlicGOUMPZTkdyV4eLtUwcfNSvI.D76lhO5trMVgGOogSFAa','U',1,'Invisible','Vu','2021-05-30 16:18:40'),
    (2,'timblack@gmail.com','$2b$10$lruhKW6R/DhNiKdfM/I0Nu9n6Z912oGadfwsmWZy0ZGWp1ej5CHdC','U',2,'Tim','Black','2021-06-08 05:23:27'),
    (3,'johncena@gmail.com','$2b$10$UoAgpFY152rH7Mpr2GWc0OcOlUn0tOOX7lIUN5jYmi7VTR.UDb5yy','U',2,'John','Cena','2021-06-09 02:25:23'),
    (4,'testemail2007@gmail.com','$2b$10$zYpJFN5YbCcxZogN24kQseLM5hdA.QuKHHs56BhBItS/j39ZBOfyS','U',2,'Trang','Nguyen','2021-06-09 02:29:20'),
    (5,'magnuscarlsen@gmail.com','$2b$10$CNdTddT3v7r4cjovBoX8B.b5pFD0tCrXnP8uqjRDJwHiKI99g78.G','U',2,'Magnus','Carlsen','2021-06-09 02:34:32');
SET IDENTITY_INSERT dbo.AppUser OFF;

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

-- ========== USER ATTEMPT (sample only) ==========
SET IDENTITY_INSERT dbo.UserAttempt ON;
INSERT INTO dbo.UserAttempt (AttemptId, UserId, QuizId, StartTime, EndTime, RemainingTime, Grade) VALUES
    (1,2,1,'2021-06-10 16:54:34','2021-06-10 17:24:45',0,0.00);
SET IDENTITY_INSERT dbo.UserAttempt OFF;

-- ========== USER ANSWER (sample only) ==========
SET IDENTITY_INSERT dbo.UserAnswer ON;
INSERT INTO dbo.UserAnswer (UserAnswerId, AttemptId, QuestionId, AnswerText, IsCorrect) VALUES
    (1,1,1,'identification',1);
SET IDENTITY_INSERT dbo.UserAnswer OFF;

-- ========== USER ESSAY ANSWER ==========
SET IDENTITY_INSERT dbo.UserEssayAnswer ON;
INSERT INTO dbo.UserEssayAnswer (UserAnswerId, EssayText, Mark, TeacherFeedback) VALUES
    (1, 'Sample essay answer text...', 90.00, 'Good job!');
SET IDENTITY_INSERT dbo.UserEssayAnswer OFF;

-- ========== USER FAVORITE ==========
INSERT INTO dbo.UserFavorite (UserId, QuizId) VALUES (1,1);

-- ========== USER RATING ==========
INSERT INTO dbo.UserRating (UserId, QuizId, RatingGiven) VALUES (1,1,5);

-- ========== VOCABULARY WORDS ==========
SET IDENTITY_INSERT dbo.VocabularyWord ON;
INSERT INTO dbo.VocabularyWord (WordId, Word, Definition, Example, PartOfSpeech, Level, Category, Difficulty) VALUES
    (1, 'abandon', 'to leave behind or give up completely', 'He decided to abandon the plan.', 'verb', 'B2', 'general', 'medium'),
    (2, 'benevolent', 'well meaning and kindly', 'A benevolent smile spread across her face.', 'adjective', 'C1', 'behavior', 'hard'),
    (3, 'candid', 'truthful and straightforward; frank', 'She gave a candid interview.', 'adjective', 'C1', 'communication', 'medium');
SET IDENTITY_INSERT dbo.VocabularyWord OFF;
-- Additional vocabulary for matching card game
SET IDENTITY_INSERT dbo.VocabularyWord ON;
INSERT INTO dbo.VocabularyWord (WordId, Word, Definition, Example, PartOfSpeech, Level, Category, Difficulty) VALUES
    (4, 'Happy', 'Feeling or showing pleasure or contentment', NULL, NULL, NULL, 'game', 'easy'),
    (5, 'Fast', 'Moving or capable of moving at high speed', NULL, NULL, NULL, 'game', 'easy'),
    (6, 'Big', 'Of considerable size or extent', NULL, NULL, NULL, 'game', 'easy'),
    (7, 'Smart', 'Having intelligence or mental alertness', NULL, NULL, NULL, 'game', 'easy'),
    (8, 'Cold', 'Having a low temperature', NULL, NULL, NULL, 'game', 'easy'),
    (9, 'Bright', 'Giving out or reflecting much light', NULL, NULL, NULL, 'game', 'easy'),
    (10, 'Elaborate', 'Involving many carefully arranged parts or details', NULL, NULL, NULL, 'game', 'medium'),
    (11, 'Substantial', 'Of considerable importance, size, or worth', NULL, NULL, NULL, 'game', 'medium'),
    (12, 'Coherent', 'Logical and consistent', NULL, NULL, NULL, 'game', 'medium'),
    (13, 'Inevitable', 'Certain to happen; unavoidable', NULL, NULL, NULL, 'game', 'medium'),
    (14, 'Profound', 'Very great or intense', NULL, NULL, NULL, 'game', 'medium'),
    (15, 'Versatile', 'Able to adapt or be adapted to many functions', NULL, NULL, NULL, 'game', 'medium'),
    (16, 'Meticulous', 'Showing great attention to detail; very careful', NULL, NULL, NULL, 'game', 'medium'),
    (17, 'Ambiguous', 'Open to more than one interpretation; unclear', NULL, NULL, NULL, 'game', 'medium'),
    (18, 'Ubiquitous', 'Present, appearing, or found everywhere', NULL, NULL, NULL, 'game', 'hard'),
    (19, 'Ephemeral', 'Lasting for a very short time', NULL, NULL, NULL, 'game', 'hard'),
    (20, 'Magnanimous', 'Very generous or forgiving', NULL, NULL, NULL, 'game', 'hard'),
    (21, 'Perspicacious', 'Having keen insight or discernment', NULL, NULL, NULL, 'game', 'hard'),
    (22, 'Surreptitious', 'Kept secret, done stealthily', NULL, NULL, NULL, 'game', 'hard'),
    (23, 'Inexorable', 'Impossible to stop or prevent', NULL, NULL, NULL, 'game', 'hard'),
    (24, 'Equivocal', 'Open to multiple interpretations; ambiguous', NULL, NULL, NULL, 'game', 'hard'),
    (25, 'Recalcitrant', 'Having an obstinately uncooperative attitude', NULL, NULL, NULL, 'game', 'hard'),
    (26, 'Parsimonious', 'Extremely frugal; unwilling to spend', NULL, NULL, NULL, 'game', 'hard'),
    (27, 'Ostentatious', 'Characterized by vulgar display of wealth', NULL, NULL, NULL, 'game', 'hard');
SET IDENTITY_INSERT dbo.VocabularyWord OFF;

-- ========== WORD GROUP ==========
SET IDENTITY_INSERT dbo.WordGroup ON;
INSERT INTO dbo.WordGroup (GroupId, Theme, Description) VALUES
    (1, 'Technology', 'Terms related to modern technology'),
    (2, 'Education', 'Words commonly seen in education topics'),
    (3, 'Environment', 'Words related to environmental issues'),
    (4, 'Business', 'Words related to business and economics'),
    (5, 'Health', 'Words related to health and medicine'),
    (6, 'Travel', 'Words related to travel and exploration');
SET IDENTITY_INSERT dbo.WordGroup OFF;

-- Vocabulary words for word association game
SET IDENTITY_INSERT dbo.VocabularyWord ON;
INSERT INTO dbo.VocabularyWord (WordId, Word, Definition, Example, PartOfSpeech, Level, Category, Difficulty) VALUES
    (28, 'student', 'a person who is studying at a school or college', NULL, NULL, NULL, 'education', 'medium'),
    (29, 'teacher', 'a person who teaches, especially in a school', NULL, NULL, NULL, 'education', 'medium'),
    (30, 'classroom', 'a room where students are taught', NULL, NULL, NULL, 'education', 'medium'),
    (31, 'homework', 'schoolwork assigned to be done outside class', NULL, NULL, NULL, 'education', 'medium'),
    (32, 'examination', 'a formal test of knowledge or ability', NULL, NULL, NULL, 'education', 'medium'),
    (33, 'graduation', 'completion of studies at a school or college', NULL, NULL, NULL, 'education', 'medium'),
    (34, 'knowledge', 'facts and information acquired through learning', NULL, NULL, NULL, 'education', 'medium'),
    (35, 'learning', 'the process of gaining knowledge or skill', NULL, NULL, NULL, 'education', 'medium'),
    (36, 'pollution', 'the presence of harmful substances in the environment', NULL, NULL, NULL, 'environment', 'medium'),
    (37, 'recycling', 'the process of converting waste into reusable material', NULL, NULL, NULL, 'environment', 'medium'),
    (38, 'conservation', 'protection of natural resources', NULL, NULL, NULL, 'environment', 'medium'),
    (39, 'renewable', 'able to be replenished naturally', NULL, NULL, NULL, 'environment', 'medium'),
    (40, 'ecosystem', 'a community of organisms and their environment', NULL, NULL, NULL, 'environment', 'medium'),
    (41, 'biodiversity', 'the variety of plant and animal life', NULL, NULL, NULL, 'environment', 'medium'),
    (42, 'sustainability', 'avoiding the depletion of natural resources', NULL, NULL, NULL, 'environment', 'medium'),
    (43, 'climate', 'the weather conditions of a region', NULL, NULL, NULL, 'environment', 'medium'),
    (44, 'innovation', 'a new method, idea, or product', NULL, NULL, NULL, 'technology', 'medium'),
    (45, 'digital', 'involving computer technology', NULL, NULL, NULL, 'technology', 'medium'),
    (46, 'artificial', 'made by humans rather than natural', NULL, NULL, NULL, 'technology', 'medium'),
    (47, 'automation', 'use of machines to perform tasks automatically', NULL, NULL, NULL, 'technology', 'medium'),
    (48, 'connectivity', 'the state of being connected or linked', NULL, NULL, NULL, 'technology', 'medium'),
    (49, 'cybersecurity', 'protection of computer systems from attack', NULL, NULL, NULL, 'technology', 'medium'),
    (50, 'database', 'an organized collection of data', NULL, NULL, NULL, 'technology', 'medium'),
    (51, 'algorithm', 'a set of rules to solve a problem', NULL, NULL, NULL, 'technology', 'medium'),
    (52, 'entrepreneur', 'a person who starts a business taking on risk', NULL, NULL, NULL, 'business', 'medium'),
    (53, 'investment', 'the action of investing money for profit', NULL, NULL, NULL, 'business', 'medium'),
    (54, 'marketing', 'the activities of promoting products', NULL, NULL, NULL, 'business', 'medium'),
    (55, 'strategy', 'a plan of action designed to achieve a goal', NULL, NULL, NULL, 'business', 'medium'),
    (56, 'competition', 'rivalry between businesses or individuals', NULL, NULL, NULL, 'business', 'medium'),
    (57, 'profit', 'financial gain after expenses', NULL, NULL, NULL, 'business', 'medium'),
    (58, 'economy', 'the system of production and consumption', NULL, NULL, NULL, 'business', 'medium'),
    (59, 'corporation', 'a large company or group of companies', NULL, NULL, NULL, 'business', 'medium'),
    (60, 'nutrition', 'the process of obtaining food necessary for health', NULL, NULL, NULL, 'health', 'medium'),
    (61, 'exercise', 'physical activity to improve fitness', NULL, NULL, NULL, 'health', 'medium'),
    (62, 'wellness', 'state of being in good health', NULL, NULL, NULL, 'health', 'medium'),
    (63, 'diagnosis', 'identification of an illness', NULL, NULL, NULL, 'health', 'medium'),
    (64, 'treatment', 'medical care given to a patient', NULL, NULL, NULL, 'health', 'medium'),
    (65, 'prevention', 'the action of stopping something from happening', NULL, NULL, NULL, 'health', 'medium'),
    (66, 'immunity', 'the ability to resist disease', NULL, NULL, NULL, 'health', 'medium'),
    (67, 'therapy', 'treatment intended to relieve or heal', NULL, NULL, NULL, 'health', 'medium'),
    (68, 'destination', 'the place to which someone is going', NULL, NULL, NULL, 'travel', 'medium'),
    (69, 'journey', 'an act of traveling from one place to another', NULL, NULL, NULL, 'travel', 'medium'),
    (70, 'accommodation', 'a place to stay or live', NULL, NULL, NULL, 'travel', 'medium'),
    (71, 'transportation', 'means of traveling from place to place', NULL, NULL, NULL, 'travel', 'medium'),
    (72, 'culture', 'customs and social behavior of a society', NULL, NULL, NULL, 'travel', 'medium'),
    (73, 'adventure', 'an unusual and exciting experience', NULL, NULL, NULL, 'travel', 'medium'),
    (74, 'exploration', 'the act of traveling to discover', NULL, NULL, NULL, 'travel', 'medium'),
    (75, 'tourism', 'the business of attracting visitors', NULL, NULL, NULL, 'travel', 'medium');
SET IDENTITY_INSERT dbo.VocabularyWord OFF;


-- ========== VOCABULARY WORD GROUP ==========
INSERT INTO dbo.VocabularyWordGroup (WordId, GroupId) VALUES
    (1, 2),
    (2, 1),
    (3, 2),
    (28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(35,2),
    (36,3),(37,3),(38,3),(39,3),(40,3),(41,3),(42,3),(43,3),
    (44,1),(45,1),(46,1),(47,1),(48,1),(49,1),(50,1),(51,1),
    (52,4),(53,4),(54,4),(55,4),(56,4),(57,4),(58,4),(59,4),
    (60,5),(61,5),(62,5),(63,5),(64,5),(65,5),(66,5),(67,5),
    (68,6),(69,6),(70,6),(71,6),(72,6),(73,6),(74,6),(75,6);
-- ========== USER VOCABULARY PROGRESS ==========
INSERT INTO dbo.UserVocabularyProgress (UserId, WordId, Mastery, LastReviewed, CorrectStreak, Attempts, Memorized) VALUES
    (1, 1, 1, '2025-06-10', 1, 1, 0),
    (1, 2, 0, NULL, 0, 0, 0),
    (2, 3, 2, '2025-06-11', 2, 3, 1);

-- ========== MOCK TEST ==========
SET IDENTITY_INSERT dbo.MockTest ON;
INSERT INTO dbo.MockTest (MockTestId, Title, Description, TotalDuration, CreatedBy, CreatedAt) VALUES
    (1, 'IELTS Mock Test 1', 'Sample IELTS test with four sections', 180, 1, '2025-06-18 00:00:00'),
    (2, 'IELTS Academic Full Mock Test #1', 'Complete IELTS Academic test covering all four skills: Listening, Reading, Writing, and Speaking', 185, 1, '2025-06-18 00:00:00'),
    (3, 'IELTS General Training Full Mock Test #1', 'Complete IELTS General Training test with practical, everyday English tasks', 185, 1, '2025-06-18 00:00:00');
SET IDENTITY_INSERT dbo.MockTest OFF;

-- ========== MOCK TEST SECTION ==========
SET IDENTITY_INSERT dbo.MockTestSection ON;
INSERT INTO dbo.MockTestSection (SectionId, MockTestId, QuizId, SkillId, Duration, TotalQuestions, SortOrder) VALUES
    (1, 1, 1, 1, 30, 7, 1),
    (2, 1, 5, 2, 60, 7, 2),
    (3, 1, 15, 3, 60, 1, 3),
    (4, 1, 13, 4, 30, 1, 4),
    (5, 2, 1, 1, 40, 40, 1),
    (6, 2, 5, 2, 60, 40, 2),
    (7, 2, 15, 3, 60, 2, 3),
    (8, 2, 13, 4, 15, 3, 4),
    (9, 3, 1, 1, 40, 40, 1),
    (10, 3, 5, 2, 60, 40, 2),
    (11, 3, 15, 3, 60, 2, 3),
    (12, 3, 13, 4, 15, 3, 4);
SET IDENTITY_INSERT dbo.MockTestSection OFF;

-- ========== WRITING ASSESSMENT ==========
SET IDENTITY_INSERT dbo.WritingAssessment ON;
INSERT INTO dbo.WritingAssessment (AssessmentId, UserEssayAnswerId, TaskResponseScore, CoherenceCohesionScore, LexicalResourcesScore, GrammaticalAccuracyScore, OverallBand, EstimatedIELTSScore, CreatedAt) VALUES
    (1, 1, 6.5, 6.0, 6.5, 6.0, 6.5, 6.5, '2025-06-18 00:00:00');
SET IDENTITY_INSERT dbo.WritingAssessment OFF;

-- ========== AUDIT TRAIL, APP LOG, USER ACTIVITY ==========
-- (You can seed these as needed, or leave empty for now.)

-- ========== END ==========
-- Ensure all tables are created and seeded correctly
PRINT 'Database QuizVerse created and seeded successfully.';
