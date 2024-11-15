package casbinservice

import (
	"context"
	"fmt"

	"github.com/casbin/casbin/v2"
)

type MockService struct {
	enforcer *casbin.Enforcer
}

func NewMockService(modelPath string, policyPath string) (*MockService, error) {

	enforcer, err := casbin.NewEnforcer(modelPath, policyPath)

	if err != nil {

		return nil, err
	}

	return &MockService{enforcer: enforcer}, nil

}

func (s *MockService) Enforce(ctx context.Context, sub, obj, act string) (bool, error) {

	ok, err := s.enforcer.Enforce(sub, obj, act)
	if err != nil {
		return false, fmt.Errorf("enforce error: %w", err) // TODO: Create Error with utils
	}
	return ok, nil
}
