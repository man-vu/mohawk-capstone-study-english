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