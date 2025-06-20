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

-- ========== APP USER ==========
SET IDENTITY_INSERT dbo.AppUser ON;
INSERT INTO dbo.AppUser (UserId, Email, PasswordHash, Gender, RoleId, FirstName, LastName, CreatedAt) VALUES
    (1,'drinvisible1997@gmail.com','$2b$10$bY2/bhlicGOUMPZTkdyV4eLtUwcfNSvI.D76lhO5trMVgGOogSFAa','U',1,'Invisible','Vu','2021-05-30 16:18:40'),
    (2,'timblack@gmail.com','$2b$10$lruhKW6R/DhNiKdfM/I0Nu9n6Z912oGadfwsmWZy0ZGWp1ej5CHdC','U',2,'Tim','Black','2021-06-08 05:23:27'),
    (3,'johncena@gmail.com','$2b$10$UoAgpFY152rH7Mpr2GWc0OcOlUn0tOOX7lIUN5jYmi7VTR.UDb5yy','U',2,'John','Cena','2021-06-09 02:25:23'),
    (4,'testemail2007@gmail.com','$2b$10$zYpJFN5YbCcxZogN24kQseLM5hdA.QuKHHs56BhBItS/j39ZBOfyS','U',2,'Trang','Nguyen','2021-06-09 02:29:20'),
    (5,'magnuscarlsen@gmail.com','$2b$10$CNdTddT3v7r4cjovBoX8B.b5pFD0tCrXnP8uqjRDJwHiKI99g78.G','U',2,'Magnus','Carlsen','2021-06-09 02:34:32');
SET IDENTITY_INSERT dbo.AppUser OFF;

-- ========== COURSE ==========
SET IDENTITY_INSERT dbo.Course ON;
INSERT INTO dbo.Course (CourseId, Title, Description, Level, Category, Duration, Skills, Features, PriceCurrent, PriceOriginal, InstructorName, InstructorAvatar, InstructorRating, InstructorExperience, Students, Rating, ReviewCount, Thumbnail, IsPopular, IsBestseller, CreatedAt) VALUES
    (1, 'Complete IELTS Preparation Course', 'Master all four IELTS skills with comprehensive practice tests and expert guidance.', 'Intermediate', 'Complete Prep', '12 weeks', 'Listening,Reading,Writing,Speaking', 'Live Classes;100+ Practice Tests;Personal Feedback;Certificate', 199, 299, 'Dr. Sarah Johnson', '/assets/images/instructor1.jpg', 4.9, '10+ years teaching IELTS', 15420, 4.8, 2340, '/assets/images/course1.jpg', 1, 1, '2025-06-18 00:00:00'),
    (2, 'IELTS Writing Mastery', 'Perfect your IELTS writing skills with proven techniques and personalized feedback.', 'Intermediate', 'Writing', '6 weeks', 'Task 1;Task 2;Grammar;Vocabulary', 'Essay Reviews;Templates;Band 9 Examples', 89, 129, 'Prof. Michael Chen', '/assets/images/instructor2.jpg', 4.7, '8 years IELTS specialist', 8930, 4.6, 1120, '/assets/images/course2.jpg', 1, 0, '2025-06-18 00:00:00'),
    (3, 'IELTS Speaking Confidence', 'Build confidence and fluency in IELTS speaking with interactive practice sessions.', 'Beginner', 'Speaking', '4 weeks', 'Pronunciation;Fluency;Part 1-3 Strategies', '1-on-1 Sessions;Mock Tests;Accent Training', 69, 99, 'Emma Thompson', '/assets/images/instructor3.jpg', 4.8, '6 years conversation expert', 6750, 4.7, 890, '/assets/images/course3.jpg', 0, 0, '2025-06-18 00:00:00');
SET IDENTITY_INSERT dbo.Course OFF;

-- ========== LEXICON TYPE ==========
SET IDENTITY_INSERT dbo.LexiconType ON;
INSERT INTO dbo.LexiconType (TypeId, TypeName) VALUES
    (1, 'Vocabulary'),
    (2, 'Idiom'),
    (3, 'Phrasal Verb');
SET IDENTITY_INSERT dbo.LexiconType OFF;

-- ========== LEXICON GROUP ==========
SET IDENTITY_INSERT dbo.LexiconGroup ON;
INSERT INTO dbo.LexiconGroup (GroupId, Theme, Description) VALUES
    (1, 'Education', 'Words commonly seen in education topics'),
    (2, 'Everyday Idioms', 'Common daily expressions'),
    (3, 'Daily Life', 'Common everyday phrasal verbs'),
    (4, 'All Idioms (Cambridge)', 'A collection of all idioms from Cambridge Dictionary'),
    (5, 'All Phrasal Verbs (Cambridge)', 'A collection of all phrasal verbs from Cambridge Dictionary'),
    (6, 'All Vocabulary (Cambridge)', 'A collection of all vocabulary words from Cambridge Dictionary'),
    (7, 'All Idioms (Longman)', 'A collection of all idioms from  Longman Dictionary')
    (8, 'All Phrasal Verbs (Longman)', 'A collection of all phrasal verbs from  Longman Dictionary'),
    (9, 'All Vocabulary (Longman)', 'A collection of all vocabulary word from  Longman Dictionary')
    (10, 'All Idioms (Oxford)', 'A collection of all idioms from Oxford Dictionary'),
    (11, 'All Phrasal Verbs (Oxford)', 'A collection of all phrasal verbs from Oxford Dictionary'),
    (12, 'All Vocabulary (Oxford)', 'A collection of all vocabulary words from Oxford Dictionary'),
    (13, 'All Idioms (Macmillan)', 'A collection of all idioms from Macmillan Dictionary'),
    (14, 'All Phrasal Verbs (Macmillan)', 'A collection of all phrasal verbs from Macmillan Dictionary'),
    (15, 'All Vocabulary (Macmillan)', 'A collection of all vocabulary words from Macmillan Dictionary'),
    (16, 'All Idioms (Merriam-Webster)', 'A collection of all idioms from Merriam-Webster Dictionary'),
    (17, 'All Phrasal Verbs (Merriam-Webster)', 'A collection of all phrasal verbs from Merriam-Webster Dictionary'),
    (18, 'All Vocabulary (Merriam-Webster)', 'A collection of all vocabulary words from Merriam-Webster Dictionary'),
    (19, 'All Idioms (Collins)', 'A collection of all idioms from Collins Dictionary'),
    (20, 'All Phrasal Verbs (Collins)', 'A collection of all phrasal verbs from Collins Dictionary'),
    (21, 'All Vocabulary (Collins)', 'A collection of all vocabulary words from Collins Dictionary');
SET IDENTITY_INSERT dbo.LexiconGroup OFF;
