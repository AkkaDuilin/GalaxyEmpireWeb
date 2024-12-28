package models

import "gorm.io/gorm"

type TaskLog struct {
	gorm.Model
	TaskID   uint   `json:"task_id"`
	TaskType int    `json:"task_type"`
	UUID     string `json:"uuid" gorm:"unique"` // Unique limit
	Status   int    `json:"status"`
	Msg      string `json:"msg"`
	ErrMsg   string `json:"err_msg"`
}
