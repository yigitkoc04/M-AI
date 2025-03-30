package model

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Resource struct {
	gorm.Model
	Topic           pq.StringArray `gorm:"type:topic_enum[]" json:"topic"`
	Title           string         `json:"title"`
	Link            string         `json:"link"`
	Level           string         `json:"level"`
	Description     string         `json:"description"`
	LinkDescription string         `json:"link_description"`
}
