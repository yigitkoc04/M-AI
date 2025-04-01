package dto

import "time"

type DashboardStats struct {
	QuizzesCompleted     int64   `json:"quizzes_completed"`
	AccuracyRate         float64 `json:"accuracy_rate"`
	MostChallengingTopic string  `json:"most_challenging_topic"`
}

type RecentActivity struct {
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Timestamp time.Time `json:"timestamp"`
}

type TopicProficiency struct {
	Topic      string  `json:"topic"`
	Correct    int64   `json:"correct"`
	Total      int64   `json:"total"`
	Percentage float64 `json:"percentage"`
}

type ChallengingTopic struct {
	Topic      string  `json:"topic"`
	Wrong      int64   `json:"wrong"`
	Total      int64   `json:"total"`
	Percentage float64 `json:"percentage"`
}
