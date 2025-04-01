package repository

import (
	"M-AI/api/dto"
	"gorm.io/gorm"
)

type DashboardRepository struct{}

func (r *DashboardRepository) GetDashboardStats(db *gorm.DB, userID uint) (dto.DashboardStats, error) {
	var stats dto.DashboardStats

	err := db.Raw(`
		SELECT 
			COUNT(DISTINCT q.id) AS quizzes_completed,
 		 	ROUND((100.0 * SUM(CASE WHEN ul.correct_answer THEN 1 ELSE 0 END)::float / NULLIF(COUNT(ul.id), 0))::numeric, 2) AS accuracy_rate,
			COALESCE((
				SELECT topic
				FROM (
					SELECT p.topic, COUNT(*) AS wrong_count
					FROM user_log ul
					JOIN problem p ON ul.problem_id = p.id
					WHERE ul.user_id = ? AND ul.correct_answer = false
					GROUP BY p.topic
					ORDER BY wrong_count DESC
					LIMIT 1
				) AS sub
			), 'Number') AS most_challenging_topic
		FROM user_log ul
		LEFT JOIN question qn ON ul.question_id = qn.id
		LEFT JOIN quiz q ON q.id = qn.quiz_id
		WHERE ul.user_id = ?
	`, userID, userID).Scan(&stats).Error

	return stats, err
}

func (r *DashboardRepository) GetRecentActivity(db *gorm.DB, userID uint) ([]dto.RecentActivity, error) {
	var activities []dto.RecentActivity

	err := db.Raw(`
		SELECT 'quiz' AS type, q.title AS title, MAX(ul.created_at) AS timestamp
		FROM user_log ul
		JOIN question qn ON ul.question_id = qn.id
		JOIN quiz q ON q.id = qn.quiz_id
		WHERE ul.user_id = ?
		GROUP BY q.id

		UNION ALL

		SELECT 'problem' AS type, p.title, MAX(ul.created_at)
		FROM user_log ul
		JOIN problem p ON p.id = ul.problem_id
		WHERE ul.user_id = ?
		GROUP BY p.id

		ORDER BY timestamp DESC
		LIMIT 5
	`, userID, userID).Scan(&activities).Error

	return activities, err
}

func (r *DashboardRepository) GetTopicProficiency(db *gorm.DB, userID uint) ([]dto.TopicProficiency, error) {
	var result []dto.TopicProficiency

	err := db.Raw(`
		SELECT
			topic,
			SUM(correct) AS correct,
			COUNT(*) AS total,
			ROUND(SUM(correct) * 100.0 / COUNT(*), 2) AS percentage
		FROM (
			-- From problems
			SELECT
				p.topic AS topic,
				CASE WHEN ul.correct_answer THEN 1 ELSE 0 END AS correct
			FROM user_log ul
			JOIN problem p ON ul.problem_id = p.id
			WHERE ul.user_id = ? AND ul.from_quiz = FALSE

			UNION ALL

			-- From quiz questions
			SELECT
				q.topic AS topic,
				CASE WHEN ul.correct_answer THEN 1 ELSE 0 END AS correct
			FROM user_log ul
			JOIN question q ON ul.question_id = q.id
			WHERE ul.user_id = ? AND ul.from_quiz = TRUE
		) AS combined
		GROUP BY topic
	`, userID, userID).Scan(&result).Error

	return result, err
}

func (r *DashboardRepository) GetChallengingTopics(db *gorm.DB, userID uint) ([]dto.ChallengingTopic, error) {
	var result []dto.ChallengingTopic

	err := db.Raw(`
		SELECT
			topic,
			SUM(wrong) AS wrongAnswers,
			COUNT(*) AS total,
			ROUND(SUM(wrong) * 100.0 / COUNT(*), 2) AS percentage
		FROM (
			-- Logs from problems
			SELECT
				p.topic AS topic,
				CASE WHEN ul.correct_answer = false THEN 1 ELSE 0 END AS wrong
			FROM user_log ul
			JOIN problem p ON ul.problem_id = p.id
			WHERE ul.user_id = ? AND ul.from_quiz = FALSE

			UNION ALL

			-- Logs from quiz questions
			SELECT
				q.topic AS topic,
				CASE WHEN ul.correct_answer = false THEN 1 ELSE 0 END AS wrong
			FROM user_log ul
			JOIN question q ON ul.question_id = q.id
			WHERE ul.user_id = ? AND ul.from_quiz = TRUE
		) AS combined
		GROUP BY topic
		ORDER BY percentage DESC
	`, userID, userID).Scan(&result).Error

	return result, err
}
