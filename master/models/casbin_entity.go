package models

// BaseCasbinEntity 包含 Casbin 必需的属性和方法
type CasbinInterface interface {
	GetEntityPrefix() string
}

type BaseCasbinEntity struct{}
