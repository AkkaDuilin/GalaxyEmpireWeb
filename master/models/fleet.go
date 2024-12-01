package models

import "gorm.io/gorm"

type Fleet struct {
	gorm.Model
	BaseCasbinEntity
	Name       string      `json:"name"`
	Ships      []Ship      `gorm:"foreignKey:FleetID"`          // 使用 hasMany 关系，指定外键
	RouteTasks []RouteTask `gorm:"many2many:route_task_fleet;"` // many2many 关系
}

func (fleet Fleet) GetEntityPrefix() string {
	return "fleet_"
}

type Ship struct {
	gorm.Model
	FleetID uint   // 外键，指向 Fleet
	Name    string `json:"name"`
	Parm    string `json:"parm"`
	Number  int    `json:"number"`
}
