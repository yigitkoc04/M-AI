package dto

import "time"

type DashboardStats struct {
	QuizzesCompleted     int64
	AccuracyRate         float64
	MostChallengingTopic string
}

type RecentActivity struct {
	Type      string // "quiz" or "problem"
	Title     string
	Timestamp time.Time
}

type TopicProficiency struct {
	Topic   string
	Correct int64
	Total   int64
}

type ChallengingTopic struct {
	Topic      string
	Wrong      int64
	Total      int64
	Percentage float64
}
