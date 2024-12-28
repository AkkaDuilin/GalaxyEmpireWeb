package utils

import "context"

func UserIDFromContext(ctx context.Context) uint {
	userID, _ := ctx.Value("userID").(uint)
	return userID
}
