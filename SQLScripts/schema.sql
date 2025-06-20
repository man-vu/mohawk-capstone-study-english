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

CREATE TABLE dbo.LexiconType (
    TypeId INT IDENTITY PRIMARY KEY,
    TypeName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE dbo.Lexicon (
    LexiconId INT IDENTITY PRIMARY KEY,
    Word NVARCHAR(100) NOT NULL,
    Definition NVARCHAR(500) NOT NULL,
    Example NVARCHAR(1000) NULL,
    PartOfSpeech NVARCHAR(50) NULL,
    Level NVARCHAR(20) NULL,
    Category NVARCHAR(100) NULL,
    Registers NVARCHAR(50) NULL, 
    Difficulty NVARCHAR(20) NULL,
    Synonyms NVARCHAR(500) NULL,
    Antonyms NVARCHAR(500) NULL,
    RelatedLexicon NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TypeId INT NOT NULL,
    CONSTRAINT FK_Lexicon_LexiconType FOREIGN KEY (TypeId)
        REFERENCES dbo.LexiconType(TypeId)
);

CREATE TABLE dbo.LexiconGroup (
    GroupId INT IDENTITY PRIMARY KEY,
    Theme NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);

CREATE TABLE dbo.LexiconGroupMap (
    LexiconId INT NOT NULL,
    GroupId INT NOT NULL,
    PRIMARY KEY (LexiconId, GroupId),
    CONSTRAINT FK_LexiconGroupMap_Lexicon FOREIGN KEY (LexiconId) REFERENCES dbo.Lexicon(LexiconId) ON DELETE CASCADE,
    CONSTRAINT FK_LexiconGroupMap_Group FOREIGN KEY (GroupId) REFERENCES dbo.LexiconGroup(GroupId) ON DELETE CASCADE
);

CREATE TABLE dbo.UserLexiconProgress (
    UserId INT NOT NULL,
    LexiconId INT NOT NULL,
    Mastery TINYINT NOT NULL DEFAULT 0,
    LastReviewed DATE NULL,
    CorrectStreak INT NOT NULL DEFAULT 0,
    Attempts INT NOT NULL DEFAULT 0,
    Memorized BIT NOT NULL DEFAULT 0,
    CONSTRAINT PK_UserLexiconProgress PRIMARY KEY (UserId, LexiconId),
    CONSTRAINT FK_UserLexiconProgress_User FOREIGN KEY (UserId) REFERENCES dbo.AppUser(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserLexiconProgress_Word FOREIGN KEY (LexiconId) REFERENCES dbo.Lexicon(LexiconId) ON DELETE CASCADE
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