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

-- Tables for Idioms
CREATE TABLE dbo.Idiom (
    IdiomId INT IDENTITY PRIMARY KEY,
    Expression NVARCHAR(200) NOT NULL UNIQUE,
    Meaning NVARCHAR(500) NOT NULL,
    Example NVARCHAR(500) NULL,
    Difficulty NVARCHAR(20) NULL
);

CREATE TABLE dbo.IdiomGroup (
    GroupId INT IDENTITY PRIMARY KEY,
    Theme NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);

CREATE TABLE dbo.IdiomGroupMap (
    IdiomId INT NOT NULL,
    GroupId INT NOT NULL,
    PRIMARY KEY (IdiomId, GroupId),
    CONSTRAINT FK_IdiomGroupMap_Idiom FOREIGN KEY (IdiomId) REFERENCES dbo.Idiom(IdiomId) ON DELETE CASCADE,
    CONSTRAINT FK_IdiomGroupMap_Group FOREIGN KEY (GroupId) REFERENCES dbo.IdiomGroup(GroupId) ON DELETE CASCADE
);

-- Tables for Phrasal Verbs
CREATE TABLE dbo.PhrasalVerb (
    VerbId INT IDENTITY PRIMARY KEY,
    Verb NVARCHAR(200) NOT NULL UNIQUE,
    Meaning NVARCHAR(500) NOT NULL,
    Example NVARCHAR(500) NULL,
    Difficulty NVARCHAR(20) NULL
);

CREATE TABLE dbo.PhrasalVerbGroup (
    GroupId INT IDENTITY PRIMARY KEY,
    Theme NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);

CREATE TABLE dbo.PhrasalVerbGroupMap (
    VerbId INT NOT NULL,
    GroupId INT NOT NULL,
    PRIMARY KEY (VerbId, GroupId),
    CONSTRAINT FK_PhrasalVerbGroupMap_Verb FOREIGN KEY (VerbId) REFERENCES dbo.PhrasalVerb(VerbId) ON DELETE CASCADE,
    CONSTRAINT FK_PhrasalVerbGroupMap_Group FOREIGN KEY (GroupId) REFERENCES dbo.PhrasalVerbGroup(GroupId) ON DELETE CASCADE
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

CREATE TABLE dbo.Course (
    CourseId INT IDENTITY PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    Level NVARCHAR(20) NULL,
    Category NVARCHAR(100) NULL,
    Duration NVARCHAR(50) NULL,
    Skills NVARCHAR(MAX) NULL,
    Features NVARCHAR(MAX) NULL,
    PriceCurrent DECIMAL(10,2) NULL,
    PriceOriginal DECIMAL(10,2) NULL,
    InstructorName NVARCHAR(100) NULL,
    InstructorAvatar NVARCHAR(255) NULL,
    InstructorRating DECIMAL(3,1) NULL,
    InstructorExperience NVARCHAR(100) NULL,
    Students INT NULL,
    Rating DECIMAL(3,1) NULL,
    ReviewCount INT NULL,
    Thumbnail NVARCHAR(255) NULL,
    IsPopular BIT NOT NULL DEFAULT 0,
    IsBestseller BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
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
INSERT INTO dbo.UserEssayAnswer (UserAnswerId, EssayText, Mark, TeacherFeedback) VALUES
    (1, 'Sample essay answer text...', 90.00, 'Good job!');

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

-- Idiom groups and idioms for word association game
SET IDENTITY_INSERT dbo.Idiom ON;
INSERT INTO dbo.Idiom (IdiomId, Expression, Meaning, Example, Difficulty) VALUES
(1, 'a blessing in disguise', 'something good that seems bad at first', 'Losing that job was a blessing in disguise.', 'easy'),
(2, 'a dime a dozen', 'very common and of little value', 'Cheap souvenirs are a dime a dozen here.', 'easy'),
(3, 'a piece of cake', 'very easy', 'The test was a piece of cake.', 'easy'),
(4, 'actions speak louder than words', 'what you do matters more than what you say', 'He promised to help, but actions speak louder than words.', 'easy'),
(5, 'add insult to injury', 'make a bad situation worse', 'He was fired and, to add insult to injury, lost his car.', 'medium'),
(6, 'all ears', 'listening carefully', 'Tell me what happened—I''m all ears.', 'easy'),
(7, 'all in the same boat', 'facing the same challenges', 'We’re all in the same boat after the changes.', 'easy'),
(8, 'an arm and a leg', 'very expensive', 'That car cost me an arm and a leg.', 'easy'),
(9, 'apple of my eye', 'someone cherished above others', 'Her daughter is the apple of her eye.', 'easy'),
(10, 'as cool as a cucumber', 'very calm', 'He was as cool as a cucumber during the interview.', 'medium'),
(11, 'at the drop of a hat', 'immediately, without hesitation', 'He will help you at the drop of a hat.', 'medium'),
(12, 'back to the drawing board', 'start again from the beginning', 'The plan failed, so it’s back to the drawing board.', 'easy'),
(13, 'barking up the wrong tree', 'looking in the wrong place', 'If you think I took your pen, you’re barking up the wrong tree.', 'medium'),
(14, 'beat a dead horse', 'waste time on something settled', 'Let’s not beat a dead horse and move on.', 'hard'),
(15, 'beat around the bush', 'avoid saying what you mean', 'Don’t beat around the bush, just tell me.', 'easy'),
(16, 'better late than never', 'it’s better to do something late than not at all', 'He finally apologized—better late than never.', 'easy'),
(17, 'between a rock and a hard place', 'facing two bad options', 'I’m between a rock and a hard place with this choice.', 'medium'),
(18, 'bite off more than you can chew', 'take on too much', 'She bit off more than she could chew at work.', 'medium'),
(19, 'bite the bullet', 'face something unpleasant', 'I decided to bite the bullet and go to the dentist.', 'medium'),
(20, 'break a leg', 'good luck', 'Break a leg at your performance tonight!', 'easy'),
(21, 'break the ice', 'make people feel relaxed', 'He told a joke to break the ice.', 'easy'),
(22, 'bring home the bacon', 'earn a living', 'He works hard to bring home the bacon.', 'medium'),
(23, 'burn the midnight oil', 'work late into the night', 'She burned the midnight oil to finish her project.', 'medium'),
(24, 'burst your bubble', 'disappoint someone', 'I hate to burst your bubble, but it won’t work.', 'medium'),
(25, 'by the book', 'follow the rules strictly', 'The accountant does everything by the book.', 'medium'),
(26, 'call it a day', 'stop working for the day', 'Let’s call it a day and go home.', 'easy'),
(27, 'cut corners', 'do something badly to save time or money', 'Don’t cut corners on this project.', 'medium'),
(28, 'catch someone red-handed', 'catch someone in the act', 'The thief was caught red-handed.', 'medium'),
(29, 'cost an arm and a leg', 'very expensive', 'The concert tickets cost an arm and a leg.', 'easy'),
(30, 'cross that bridge when you come to it', 'deal with a problem when it happens', 'Let’s cross that bridge when we come to it.', 'easy'),
(31, 'cry over spilled milk', 'waste time worrying about past mistakes', 'Don’t cry over spilled milk.', 'easy'),
(32, 'curiosity killed the cat', 'asking too many questions may cause trouble', 'Be careful—curiosity killed the cat.', 'easy'),
(33, 'cut to the chase', 'get to the point', 'Let’s cut to the chase.', 'easy'),
(34, 'cold feet', 'nervousness before an event', 'He got cold feet before the wedding.', 'medium'),
(35, 'come rain or shine', 'no matter what happens', 'I’ll be there come rain or shine.', 'medium'),
(36, 'chip on your shoulder', 'holding a grudge', 'He has a chip on his shoulder about the decision.', 'hard'),
(37, 'climb the ladder', 'advance in your career', 'She’s climbing the ladder at her firm.', 'medium'),
(38, 'close but no cigar', 'almost successful', 'He was close but no cigar in the race.', 'medium'),
(39, 'cut the mustard', 'meet expectations', 'He didn’t cut the mustard in his new role.', 'hard'),
(40, 'couch potato', 'a lazy person', 'He became a couch potato after retirement.', 'easy'),
(41, 'call the shots', 'make decisions', 'The manager calls the shots at work.', 'medium'),
(42, 'clear the air', 'settle misunderstandings', 'Let’s clear the air about our argument.', 'medium'),
(43, 'come clean', 'confess', 'It’s time to come clean about what happened.', 'easy'),
(44, 'crack the code', 'figure something out', 'She finally cracked the code to the puzzle.', 'medium'),
(45, 'change your tune', 'change your opinion', 'He changed his tune after hearing the facts.', 'medium'),
(46, 'chew the fat', 'chat casually', 'They chewed the fat over coffee.', 'medium'),
(47, 'chip off the old block', 'a child resembling their parent', 'He’s a chip off the old block.', 'easy'),
(48, 'come to grips with', 'accept a difficult reality', 'She came to grips with the news.', 'medium'),
(49, 'crocodile tears', 'fake tears', 'She cried crocodile tears at the story.', 'medium'),
(50, 'cut and dried', 'clear and definite', 'The rules are cut and dried.', 'hard'),
(51, 'devil’s advocate', 'argue the opposing side', 'She played devil’s advocate to test our plan.', 'medium'),
(52, 'don’t count your chickens before they hatch', 'don’t assume success too soon', 'Don’t count your chickens before they hatch.', 'easy'),
(53, 'don’t put all your eggs in one basket', 'don’t risk everything on one plan', 'He invests in different stocks to avoid putting all his eggs in one basket.', 'easy'),
(54, 'down to earth', 'practical and realistic', 'She’s so down to earth.', 'easy'),
(55, 'draw the line', 'set a limit', 'I draw the line at lying.', 'medium'),
(56, 'dressed to the nines', 'wearing fashionable clothes', 'She arrived dressed to the nines.', 'medium'),
(57, 'drop a dime', 'give information to authorities', 'He dropped a dime on his accomplice.', 'hard'),
(58, 'drop the ball', 'make a mistake', 'He dropped the ball on the project.', 'easy'),
(59, 'dry run', 'practice before the real event', 'Let’s do a dry run before the show.', 'medium'),
(60, 'dog days', 'the hottest days of summer', 'The dog days of summer are here.', 'medium'),
(61, 'don’t beat a dead horse', 'don’t waste time on a lost cause', 'Stop arguing—don’t beat a dead horse.', 'medium'),
(62, 'dig in your heels', 'refuse to change your mind', 'She dug in her heels and wouldn’t compromise.', 'hard'),
(63, 'double-edged sword', 'something that has both positive and negative effects', 'Fame is a double-edged sword.', 'medium'),
(64, 'dutch courage', 'bravery from drinking alcohol', 'He got some Dutch courage before his speech.', 'hard'),
(65, 'down in the dumps', 'feeling sad', 'She’s down in the dumps today.', 'easy'),
(66, 'elephant in the room', 'an obvious issue no one talks about', 'Let’s address the elephant in the room.', 'easy'),
(67, 'every cloud has a silver lining', 'there’s something good in every bad situation', 'Losing the job hurt, but every cloud has a silver lining.', 'easy'),
(68, 'eye for an eye', 'revenge or retribution', 'He wanted an eye for an eye after the incident.', 'medium'),
(69, 'face the music', 'accept the consequences', 'It’s time to face the music.', 'easy'),
(70, 'fall on deaf ears', 'get ignored', 'Her warnings fell on deaf ears.', 'medium'),
(71, 'far cry from', 'very different from', 'Living here is a far cry from city life.', 'medium'),
(72, 'feather in your cap', 'an achievement to be proud of', 'Winning the award was a feather in her cap.', 'medium'),
(73, 'few and far between', 'rare', 'Good restaurants are few and far between here.', 'easy'),
(74, 'fight tooth and nail', 'fight very fiercely', 'She fought tooth and nail for her rights.', 'medium'),
(75, 'find your feet', 'become confident in a new situation', 'He’s finally finding his feet at the new job.', 'medium'),
(76, 'fish out of water', 'feel uncomfortable', 'I felt like a fish out of water at the party.', 'easy'),
(77, 'flash in the pan', 'something that happens only once', 'His early success was just a flash in the pan.', 'medium'),
(78, 'fly off the handle', 'get angry quickly', 'He flies off the handle easily.', 'medium'),
(79, 'fly the coop', 'leave suddenly', 'The kids have all flown the coop.', 'medium'),
(80, 'follow in someone’s footsteps', 'do the same as someone else', 'He followed in his father’s footsteps.', 'easy'),
(81, 'food for thought', 'something to think about', 'That article gave me food for thought.', 'easy'),
(82, 'for the birds', 'not important or not useful', 'His advice is for the birds.', 'hard'),
(83, 'for the record', 'to make something clear', 'For the record, I did not agree.', 'easy'),
(84, 'from the horse’s mouth', 'directly from the source', 'I got the news from the horse’s mouth.', 'easy'),
(85, 'full of hot air', 'talking nonsense', 'He’s full of hot air.', 'medium'),
(86, 'familiar face', 'someone you recognize', 'It’s nice to see a familiar face.', 'easy'),
(87, 'foot the bill', 'pay for something', 'My parents footed the bill for my trip.', 'medium'),
(88, 'face value', 'the apparent worth', 'Take the offer at face value.', 'easy'),
(89, 'fair-weather friend', 'a friend only when things are good', 'She turned out to be a fair-weather friend.', 'medium'),
(90, 'fill someone in', 'provide information', 'Can you fill me in on what happened?', 'easy'),
(91, 'find your calling', 'discover your life’s purpose', 'She finally found her calling as a teacher.', 'medium'),
(92, 'fit as a fiddle', 'in good health', 'He’s as fit as a fiddle at 80.', 'easy'),
(93, 'fishy', 'suspicious', 'That story sounds fishy to me.', 'easy'),
(94, 'fool’s gold', 'something that appears valuable but isn’t', 'His promise was fool’s gold.', 'medium'),
(95, 'foot in the door', 'a first step toward a goal', 'That internship was her foot in the door.', 'medium'),
(96, 'fortune favors the bold', 'brave people succeed', 'Fortune favors the bold, so take the risk.', 'medium'),
(97, 'freeze up', 'become unable to act', 'I froze up during the interview.', 'easy'),
(98, 'frog in your throat', 'difficulty speaking', 'He had a frog in his throat and could hardly talk.', 'medium'),
(99, 'from scratch', 'starting from the beginning', 'She built the company from scratch.', 'easy'),
(100, 'full plate', 'very busy', 'I have a full plate this week.', 'easy'),
(101, 'game plan', 'strategy for achieving a goal', 'Let’s make a game plan for the meeting.', 'easy'),
(102, 'get a taste of your own medicine', 'be treated the way you treat others', 'He got a taste of his own medicine.', 'medium'),
(103, 'get cold feet', 'become nervous', 'She got cold feet before the show.', 'easy'),
(104, 'get in touch', 'contact someone', 'I’ll get in touch soon.', 'easy'),
(105, 'get out of hand', 'become uncontrolled', 'The party got out of hand.', 'medium'),
(106, 'get the ball rolling', 'start something', 'Let’s get the ball rolling on this project.', 'easy'),
(107, 'get the hang of', 'learn how to do something', 'You’ll get the hang of it soon.', 'easy'),
(108, 'get to the bottom of', 'find the real cause', 'We need to get to the bottom of this issue.', 'medium'),
(109, 'give someone a hand', 'help someone', 'Can you give me a hand with this?', 'easy'),
(110, 'give someone a piece of your mind', 'tell someone you are angry', 'She gave him a piece of her mind.', 'medium'),
(111, 'give the benefit of the doubt', 'believe someone without proof', 'I’ll give you the benefit of the doubt.', 'easy'),
(112, 'go back to square one', 'start again from the beginning', 'We have to go back to square one.', 'medium'),
(113, 'go bananas', 'go crazy', 'The crowd went bananas.', 'easy'),
(114, 'go down in flames', 'fail spectacularly', 'His idea went down in flames.', 'medium'),
(115, 'go the extra mile', 'do more than required', 'She always goes the extra mile.', 'medium'),
(116, 'go with the flow', 'accept things as they come', 'Just go with the flow.', 'easy'),
(117, 'grasp at straws', 'try something with little hope', 'He’s grasping at straws now.', 'medium'),
(118, 'green with envy', 'very jealous', 'She was green with envy.', 'easy'),
(119, 'gut feeling', 'intuition', 'I have a gut feeling about this.', 'easy'),
(120, 'give someone the cold shoulder', 'ignore someone', 'He gave me the cold shoulder.', 'medium'),
(121, 'get wind of', 'hear about something', 'She got wind of the secret.', 'medium'),
(122, 'go off the deep end', 'overreact', 'He went off the deep end when he heard the news.', 'medium'),
(123, 'give up the ghost', 'stop trying or die', 'My car gave up the ghost.', 'hard'),
(124, 'get away with', 'avoid punishment', 'He got away with cheating.', 'easy'),
(125, 'go out on a limb', 'take a risk', 'I’ll go out on a limb and say yes.', 'medium'),
(126, 'good as gold', 'very well-behaved', 'The kids were as good as gold.', 'easy'),
(127, 'get a kick out of', 'enjoy', 'I get a kick out of old movies.', 'easy'),
(128, 'go down the drain', 'be wasted', 'All our work went down the drain.', 'medium'),
(129, 'go for broke', 'risk everything', 'They went for broke to win.', 'medium'),
(130, 'give someone the runaround', 'avoid giving a clear answer', 'They gave me the runaround.', 'medium'),
(131, 'go out of your way', 'do something extra', 'She went out of her way to help.', 'medium'),
(132, 'get your act together', 'organize yourself', 'You need to get your act together.', 'easy'),
(133, 'get under someone’s skin', 'annoy someone', 'His comments get under my skin.', 'medium'),
(134, 'go the whole nine yards', 'do something completely', 'She went the whole nine yards.', 'medium'),
(135, 'give it a shot', 'try', 'Let’s give it a shot.', 'easy'),
(136, 'get your feet wet', 'try something for the first time', 'I’m just getting my feet wet in this field.', 'medium'),
(137, 'give someone a hard time', 'make things difficult', 'He gave me a hard time.', 'easy'),
(138, 'get in over your head', 'take on too much', 'He’s in over his head at work.', 'medium'),
(139, 'go out of fashion', 'become outdated', 'Bell-bottoms went out of fashion.', 'easy'),
(140, 'go to great lengths', 'make a big effort', 'She went to great lengths to win.', 'medium'),
(141, 'get a move on', 'hurry up', 'Get a move on or we’ll be late.', 'easy'),
(142, 'grin and bear it', 'accept something unpleasant', 'Just grin and bear it.', 'medium'),
(143, 'go to your head', 'make someone arrogant', 'Fame went to his head.', 'medium'),
(144, 'get off on the wrong foot', 'make a bad start', 'They got off on the wrong foot.', 'medium'),
(146, 'get straight to the point', 'be direct', 'Let’s get straight to the point.', 'easy'),
(147, 'give someone a break', 'stop criticizing', 'Give him a break; he’s trying.', 'easy'),
(148, 'get away from it all', 'go somewhere to relax', 'She went to the mountains to get away from it all.', 'medium'),
(149, 'go out with a bang', 'finish impressively', 'The event went out with a bang.', 'medium'),
(150, 'in a nutshell', 'in summary', 'In a nutshell, we won.', 'easy'),
(151, 'jack of all trades', 'someone skilled at many things', 'He’s a jack of all trades.', 'easy'),
(152, 'jam-packed', 'very full', 'The train was jam-packed this morning.', 'easy'),
(153, 'jog your memory', 'help someone remember', 'That song jogged my memory.', 'medium'),
(154, 'jump on the bandwagon', 'join something popular', 'He jumped on the bandwagon and started investing.', 'medium'),
(155, 'jump the gun', 'do something too soon', 'He jumped the gun and answered before hearing the question.', 'easy'),
(156, 'jump to conclusions', 'assume something too quickly', 'Don’t jump to conclusions.', 'easy'),
(157, 'just in the nick of time', 'at the last possible moment', 'We caught the train just in the nick of time.', 'easy'),
(158, 'join the club', 'be in the same situation as others', 'You’re tired? Join the club!', 'easy'),
(159, 'jump for joy', 'be very happy', 'She jumped for joy when she won.', 'easy'),
(160, 'juggle tasks', 'handle several things at once', 'He’s juggling tasks at work.', 'medium'),
(161, 'keep an eye on', 'watch carefully', 'Keep an eye on the kids.', 'easy'),
(162, 'keep your chin up', 'stay positive', 'Keep your chin up during tough times.', 'easy'),
(163, 'keep your fingers crossed', 'hope for good luck', 'I’m keeping my fingers crossed for you.', 'easy'),
(164, 'keep your nose to the grindstone', 'work hard', 'She keeps her nose to the grindstone.', 'medium'),
(165, 'kick the bucket', 'die', 'The old man finally kicked the bucket.', 'medium'),
(166, 'kill two birds with one stone', 'achieve two things at once', 'I killed two birds with one stone by shopping and visiting a friend.', 'easy'),
(167, 'know the ropes', 'understand the details', 'After a week, you’ll know the ropes.', 'easy'),
(168, 'knock on wood', 'hope for continued good luck', 'I’ve been healthy, knock on wood.', 'easy'),
(169, 'keep your cool', 'stay calm', 'Keep your cool in stressful situations.', 'medium'),
(170, 'keep someone at arm’s length', 'avoid being too friendly', 'She keeps her coworkers at arm’s length.', 'medium'),
(171, 'kick up your heels', 'celebrate', 'After finals, we kicked up our heels.', 'medium'),
(172, 'know by heart', 'memorize', 'She knows all the lyrics by heart.', 'easy'),
(173, 'knock yourself out', 'go ahead, help yourself', 'Knock yourself out—have some cake.', 'medium'),
(174, 'keep tabs on', 'monitor closely', 'I keep tabs on my expenses.', 'medium'),
(175, 'knock it off', 'stop doing something', 'Knock it off and listen.', 'easy'),
(176, 'let the cat out of the bag', 'reveal a secret', 'He let the cat out of the bag.', 'easy'),
(177, 'leave no stone unturned', 'search everywhere', 'The police left no stone unturned.', 'medium'),
(178, 'lend an ear', 'listen to someone', 'Thanks for lending an ear.', 'easy'),
(179, 'let sleeping dogs lie', 'don’t disturb a situation as it is', 'Let’s let sleeping dogs lie.', 'medium'),
(180, 'level playing field', 'fair situation', 'The new law creates a level playing field.', 'medium'),
(181, 'let bygones be bygones', 'forgive and forget', 'Let’s let bygones be bygones.', 'easy'),
(182, 'let off steam', 'release stress', 'He lets off steam by running.', 'easy'),
(183, 'light at the end of the tunnel', 'hope after difficulty', 'There’s finally a light at the end of the tunnel.', 'easy'),
(184, 'lion’s share', 'the largest part', 'He got the lion’s share of the credit.', 'medium'),
(185, 'live and learn', 'learn from mistakes', 'I lost money, but live and learn.', 'easy'),
(186, 'look before you leap', 'consider carefully before acting', 'Look before you leap.', 'easy'),
(187, 'lose your touch', 'lose an ability you once had', 'He can’t play piano—he’s lost his touch.', 'medium'),
(188, 'love at first sight', 'fall in love immediately', 'It was love at first sight.', 'easy'),
(189, 'let nature take its course', 'allow events to happen naturally', 'Let nature take its course.', 'medium'),
(190, 'learn the ropes', 'learn how to do a job', 'It took a month to learn the ropes.', 'easy'),
(191, 'let your hair down', 'relax and have fun', 'Let your hair down at the party.', 'medium'),
(192, 'last straw', 'the final problem in a series', 'His rude remark was the last straw.', 'medium'),
(193, 'leave someone in the lurch', 'abandon someone in difficulty', 'He left me in the lurch.', 'hard'),
(194, 'long story short', 'to summarize', 'Long story short, I got the job.', 'easy'),
(195, 'look down on', 'consider someone inferior', 'Don’t look down on others.', 'medium'),
(196, 'lose your marbles', 'go crazy', 'He’s lost his marbles.', 'medium'),
(197, 'look up to', 'admire someone', 'I look up to my older brother.', 'easy'),
(198, 'lay it on thick', 'exaggerate', 'He laid it on thick about his role.', 'medium'),
(199, 'leave no room for doubt', 'make something certain', 'Her evidence left no room for doubt.', 'medium'),
(200, 'let your guard down', 'become less cautious', 'He let his guard down and got hurt.', 'medium'),
(201, 'make a long story short', 'summarize briefly', 'To make a long story short, we moved.', 'easy'),
(202, 'make ends meet', 'have enough money to live', 'It’s hard to make ends meet on one salary.', 'easy'),
(203, 'make waves', 'cause trouble or change', 'He made waves with his new ideas.', 'medium'),
(204, 'miss the boat', 'miss an opportunity', 'I missed the boat on investing early.', 'easy'),
(205, 'method to my madness', 'reason behind strange behavior', 'There’s a method to my madness.', 'medium'),
(206, 'money doesn’t grow on trees', 'money is hard to get', 'Remember, money doesn’t grow on trees.', 'easy'),
(207, 'move heaven and earth', 'try very hard', 'She moved heaven and earth to help.', 'medium'),
(208, 'mum’s the word', 'keep it a secret', 'Mum’s the word about the surprise.', 'easy'),
(209, 'my hands are tied', 'unable to act', 'I want to help, but my hands are tied.', 'medium'),
(210, 'make the best of it', 'accept and deal with a bad situation', 'Let’s make the best of it.', 'easy'),
(211, 'music to my ears', 'pleasant news', 'Her praise was music to my ears.', 'easy'),
(212, 'melt your heart', 'make you feel love or sympathy', 'The puppy’s face will melt your heart.', 'medium'),
(213, 'make a mountain out of a molehill', 'exaggerate a small problem', 'Don’t make a mountain out of a molehill.', 'easy'),
(214, 'move the goalposts', 'change the rules unfairly', 'They moved the goalposts during the project.', 'medium'),
(215, 'miss the mark', 'fail to achieve the result', 'His joke missed the mark.', 'medium'),
(216, 'make your blood boil', 'make you very angry', 'The unfairness made my blood boil.', 'medium'),
(217, 'make up your mind', 'decide', 'Make up your mind already!', 'easy'),
(218, 'mark my words', 'remember what I say', 'Mark my words, you’ll regret it.', 'easy'),
(219, 'mumbo jumbo', 'meaningless language', 'The instructions were just mumbo jumbo.', 'medium'),
(220, 'midas touch', 'ability to make money easily', 'He has the Midas touch in business.', 'medium'),
(221, 'move mountains', 'achieve something difficult', 'She will move mountains for her family.', 'medium'),
(222, 'needle in a haystack', 'hard to find', 'Finding my keys here is like a needle in a haystack.', 'easy'),
(223, 'neck of the woods', 'neighborhood or area', 'There’s a new café in my neck of the woods.', 'easy'),
(224, 'nip it in the bud', 'stop something before it gets worse', 'Let’s nip this problem in the bud.', 'easy'),
(225, 'no pain, no gain', 'effort is needed for success', 'You must work hard—no pain, no gain.', 'easy'),
(226, 'not playing with a full deck', 'crazy or not sane', 'He’s not playing with a full deck.', 'medium'),
(227, 'nothing to sneeze at', 'worth considering', 'The offer is nothing to sneeze at.', 'medium'),
(228, 'nutty as a fruitcake', 'crazy', 'He’s nutty as a fruitcake.', 'medium'),
(229, 'nose to the grindstone', 'work hard', 'She keeps her nose to the grindstone.', 'easy'),
(230, 'not the end of the world', 'not a disaster', 'Failing the test isn’t the end of the world.', 'easy'),
(231, 'off the top of your head', 'without thinking much', 'I can’t remember off the top of my head.', 'easy'),
(232, 'off the hook', 'free from blame or trouble', 'You’re off the hook for the mistake.', 'easy'),
(233, 'off the beaten path', 'not usual or popular', 'We took a trip off the beaten path.', 'medium'),
(234, 'on cloud nine', 'very happy', 'She’s on cloud nine after the news.', 'easy'),
(235, 'on the ball', 'alert and efficient', 'Our new assistant is really on the ball.', 'easy'),
(236, 'on the fence', 'undecided', 'I’m still on the fence about it.', 'easy'),
(237, 'on thin ice', 'in a risky situation', 'You’re on thin ice with your boss.', 'medium'),
(238, 'on your last leg', 'about to fail or die', 'The car is on its last leg.', 'medium'),
(239, 'once in a blue moon', 'very rarely', 'We go out once in a blue moon.', 'easy'),
(240, 'open a can of worms', 'create a new problem', 'Asking may open a can of worms.', 'medium'),
(241, 'out of the blue', 'unexpectedly', 'He called me out of the blue.', 'easy'),
(242, 'out of the woods', 'out of danger', 'She’s finally out of the woods.', 'medium'),
(243, 'over the moon', 'extremely happy', 'He was over the moon about the result.', 'easy'),
(244, 'over your head', 'too difficult to understand', 'The lecture went over my head.', 'medium'),
(245, 'on the same page', 'in agreement', 'We’re finally on the same page.', 'easy'),
(246, 'off the record', 'not to be made public', 'This is off the record.', 'medium'),
(247, 'open book', 'easy to understand or know', 'She’s an open book.', 'easy'),
(248, 'on pins and needles', 'nervous or anxious', 'I was on pins and needles waiting.', 'medium'),
(249, 'out of the question', 'not possible', 'A raise is out of the question now.', 'medium'),
(250, 'out of sorts', 'feeling unwell', 'He’s out of sorts today.', 'medium')

SET IDENTITY_INSERT dbo.Idiom OFF;

SET IDENTITY_INSERT dbo.IdiomGroup ON;
INSERT INTO dbo.IdiomGroup (GroupId, Theme, Description) VALUES
    (1, 'Everyday Idioms', 'Common daily expressions'),
    (2, 'Success Idioms', 'Idioms about success and failure'),
    (3, 'Time Idioms', 'Idioms related to time');
SET IDENTITY_INSERT dbo.IdiomGroup OFF;

INSERT INTO dbo.IdiomGroupMap (IdiomId, GroupId) VALUES
    (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),
    (9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),
    (17,3),(18,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3);

-- Phrasal verb groups and verbs for word association game
SET IDENTITY_INSERT dbo.PhrasalVerb ON;
INSERT INTO dbo.PhrasalVerb (VerbId, Verb, Meaning, Example, Difficulty) VALUES
    (1, 'get up', 'rise from bed', 'I get up at seven.', 'easy'),
    (2, 'pick up', 'collect', 'Please pick up the kids.', 'easy'),
    (3, 'look after', 'take care of', 'She looks after her brother.', 'easy'),
    (4, 'carry on', 'continue', 'Carry on with your work.', 'easy'),
    (5, 'hang out', 'spend time relaxing', 'They hang out at the mall.', 'easy'),
    (6, 'turn off', 'stop a device', 'Turn off the lights.', 'easy'),
    (7, 'put away', 'store', 'Put away your clothes.', 'easy'),
    (8, 'give up', 'stop trying', 'Never give up.', 'easy'),
    (9, 'check in', 'register at a hotel or airport', 'We checked in early.', 'medium'),
    (10, 'take off', 'leave the ground', 'The plane took off.', 'medium'),
    (11, 'set out', 'begin a journey', 'They set out at dawn.', 'medium'),
    (12, 'get away', 'go on vacation', 'We hope to get away this weekend.', 'medium'),
    (13, 'stop over', 'stay somewhere temporarily', 'We stopped over in Dubai.', 'medium'),
    (14, 'look around', 'explore', 'We looked around the city.', 'medium'),
    (15, 'hurry up', 'do something faster', 'Hurry up or we''ll be late.', 'medium'),
    (16, 'take in', 'absorb or understand', 'It was hard to take in the news.', 'medium'),
    (17, 'set up', 'arrange or establish', 'They set up a new company.', 'hard'),
    (18, 'run by', 'get approval from', 'Run it by the manager first.', 'hard'),
    (19, 'take over', 'assume control', 'The firm was taken over.', 'hard'),
    (20, 'go through', 'examine carefully', 'Let''s go through the details.', 'hard'),
    (21, 'draw up', 'prepare a document', 'They drew up a contract.', 'hard'),
    (22, 'branch out', 'expand into new areas', 'The company branched out overseas.', 'hard'),
    (23, 'cut back', 'reduce', 'We need to cut back expenses.', 'hard'),
    (24, 'close down', 'cease operations', 'The shop closed down.', 'hard');
SET IDENTITY_INSERT dbo.PhrasalVerb OFF;


SET IDENTITY_INSERT dbo.PhrasalVerbGroup ON;
INSERT INTO dbo.PhrasalVerbGroup (GroupId, Theme, Description) VALUES
    (1,'Daily Life','Common everyday phrasal verbs'),
    (2,'Travel','Phrasal verbs used when traveling'),
    (3,'Business','Business related phrasal verbs');
SET IDENTITY_INSERT dbo.PhrasalVerbGroup OFF;

INSERT INTO dbo.PhrasalVerbGroupMap (VerbId, GroupId) VALUES
    (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),
    (9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),
    (17,3),(18,3),(19,3),(20,3),(21,3),(22,3),(23,3),(24,3);
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

-- ========== COURSE ==========
SET IDENTITY_INSERT dbo.Course ON;
INSERT INTO dbo.Course (CourseId, Title, Description, Level, Category, Duration, Skills, Features, PriceCurrent, PriceOriginal, InstructorName, InstructorAvatar, InstructorRating, InstructorExperience, Students, Rating, ReviewCount, Thumbnail, IsPopular, IsBestseller, CreatedAt) VALUES
    (1, 'Complete IELTS Preparation Course', 'Master all four IELTS skills with comprehensive practice tests and expert guidance.', 'Intermediate', 'Complete Prep', '12 weeks', 'Listening,Reading,Writing,Speaking', 'Live Classes;100+ Practice Tests;Personal Feedback;Certificate', 199, 299, 'Dr. Sarah Johnson', '/assets/images/instructor1.jpg', 4.9, '10+ years teaching IELTS', 15420, 4.8, 2340, '/assets/images/course1.jpg', 1, 1, '2025-06-18 00:00:00'),
    (2, 'IELTS Writing Mastery', 'Perfect your IELTS writing skills with proven techniques and personalized feedback.', 'Intermediate', 'Writing', '6 weeks', 'Task 1;Task 2;Grammar;Vocabulary', 'Essay Reviews;Templates;Band 9 Examples', 89, 129, 'Prof. Michael Chen', '/assets/images/instructor2.jpg', 4.7, '8 years IELTS specialist', 8930, 4.6, 1120, '/assets/images/course2.jpg', 1, 0, '2025-06-18 00:00:00'),
    (3, 'IELTS Speaking Confidence', 'Build confidence and fluency in IELTS speaking with interactive practice sessions.', 'Beginner', 'Speaking', '4 weeks', 'Pronunciation;Fluency;Part 1-3 Strategies', '1-on-1 Sessions;Mock Tests;Accent Training', 69, 99, 'Emma Thompson', '/assets/images/instructor3.jpg', 4.8, '6 years conversation expert', 6750, 4.7, 890, '/assets/images/course3.jpg', 0, 0, '2025-06-18 00:00:00');
SET IDENTITY_INSERT dbo.Course OFF;

-- ========== AUDIT TRAIL, APP LOG, USER ACTIVITY ==========
-- (You can seed these as needed, or leave empty for now.)

-- ========== END ==========
-- Ensure all tables are created and seeded correctly
PRINT 'Database QuizVerse created and seeded successfully.';
