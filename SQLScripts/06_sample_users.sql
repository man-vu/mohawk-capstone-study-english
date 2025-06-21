

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

-- ========== USER LEXICON PROGRESS ==========
INSERT INTO dbo.UserLexiconProgress (UserId, LexiconId, Mastery, LastReviewed, CorrectStreak, Attempts, Memorized) VALUES
    (1, 1, 1, '2025-06-10', 1, 1, 0),
    (1, 4, 0, NULL, 0, 0, 0);

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
