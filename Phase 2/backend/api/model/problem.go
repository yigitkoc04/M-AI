package model

import (
	"M-AI/api/constants"
	"gorm.io/gorm"
)

type Problem struct {
	gorm.Model
	Topic    constants.TopicEnum `gorm:"type:topic_enum" json:"topic"`
	Title    string              `json:"title"`
	Question string              `json:"question"`
}
