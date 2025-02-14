package models

import (
	"time"

	"gorm.io/gorm"
)

// Account represents a user account in the system.
// It includes fields for the username, password, email, server, and related tasks.
type Account struct {
	gorm.Model
	BaseCasbinEntity
	Username string    `gorm:"type:varchar(100);not null;uniqueIndex:idx_username_server"`
	Password string    `gorm:"not null"` // MD5 hash TODO:
	Email    string    `gorm:"not null"`
	Server   string    `gorm:"type:varchar(100);not null;uniqueIndex:idx_username_server"`
	ExpireAt time.Time `gorm:"type:datetime(3);default:CURRENT_TIMESTAMP(3)"`
	Tasks    []Task    `gorm:"foreignKey:AccountID"`
	UserID   uint
}

func (account Account) GetEntityPrefix() string {
	return "account_"
}

type AccountInfo struct {
	Username string `json:"username"`
	Password string `json:"password"` // MD5 hash
	Server   string `json:"server"`
	Email    string `json:"email"`
}

// TODO: add init func to set expire time
func NewAccount(username, password, email, server string) *Account {
	return &Account{
		Username: username,
		Password: password,
		Email:    email,
		Server:   server,
		ExpireAt: time.Now().AddDate(0, 0, -1),
	}
}

// ToDTO converts an Account to an AccountDTO.
func (account *Account) ToDTO() *AccountDTO {
	tasks := make([]*TaskDTO, len(account.Tasks))
	for i, task := range account.Tasks {
		tasks[i] = task.ToDTO()
	}
	return &AccountDTO{
		ID:       account.ID,
		Username: account.Username,
		Email:    account.Email,
		Server:   account.Server,
		ExpireAt: account.ExpireAt,
		Tasks:    tasks,
	}
}
func (account *Account) ToInfo() *AccountInfo {
	return &AccountInfo{
		Username: account.Username,
		Password: account.Password,
		Server:   account.Server,
	}
}

// AccountDTO is a data transfer object for Account.
// It is used when interacting with external systems.
type AccountDTO struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Server   string `json:"server"`
	ExpireAt time.Time
	Tasks    []*TaskDTO `json:"tasks"`
}

// ToModel converts an AccountDTO to an Account.
func (accountDTO *AccountDTO) ToModel() *Account {
	return &Account{
		Model: gorm.Model{
			ID: accountDTO.ID,
		},
		Username: accountDTO.Username,
		Email:    accountDTO.Email,
		Server:   accountDTO.Server,
	}
}
