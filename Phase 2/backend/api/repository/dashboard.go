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
		SELECT 'quiz' AS type, q.topic AS title, MAX(ul.created_at) AS timestamp
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
		LIMIT 10
	`, userID, userID).Scan(&activities).Error

	return activities, err
}

func (r *DashboardRepository) GetTopicProficiency(db *gorm.DB, userID uint) ([]dto.TopicProficiency, error) {
	var result []dto.TopicProficiency

	err := db.Raw(`
		SELECT
			p.topic,
			SUM(CASE WHEN ul.correct_answer THEN 1 ELSE 0 END) AS correct,
			COUNT(*) AS total
		FROM user_log ul
		JOIN problem p ON ul.problem_id = p.id
		WHERE ul.user_id = ?
		GROUP BY p.topic
	`, userID).Scan(&result).Error

	return result, err
}

func (r *DashboardRepository) GetChallengingTopics(db *gorm.DB, userID uint) ([]dto.ChallengingTopic, error) {
	var result []dto.ChallengingTopic

	err := db.Raw(`
		SELECT
			p.topic,
			SUM(CASE WHEN ul.correct_answer = false THEN 1 ELSE 0 END) AS wrong,
			COUNT(*) AS total,
			ROUND(100.0 * SUM(CASE WHEN ul.correct_answer = false THEN 1 ELSE 0 END)::float / COUNT(*), 2) AS percentage
		FROM user_log ul
		JOIN problem p ON ul.problem_id = p.id
		WHERE ul.user_id = ?
		GROUP BY p.topic
		ORDER BY percentage DESC
	`, userID).Scan(&result).Error

	return result, err
}
