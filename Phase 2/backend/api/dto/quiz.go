package dto

import (
	"time"
)

type QuizWithStats struct {
	ID              uint
	Topic           string
	Level           string
	Time            int
	CreatedAt       time.Time
	Score           int64
	CompletedAt     *time.Time
	CompletedInTime bool
}
