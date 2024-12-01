package queue

type Queue interface {
	// Push a new value onto the queue
	Push(string, string) error
}
