# Stage 1: Build the Go application
FROM golang:1.21-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./

# Download the Go module dependencies
RUN go mod download

# Copy the source code
COPY . .

# Enable CGO and build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Create a lightweight final image
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

COPY ./config/ /app/config/

# Expose the port the application runs on (if needed)
EXPOSE 9333

# Command to run the application
CMD ["./main"]
