package service

import "errors"

type ServiceError struct {
	Code    string
	Message string
	Err     error
}

func (e *ServiceError) Error() string {
	return e.Message
}

func (e *ServiceError) Unwrap() error {
	return e.Err
}

func NotFoundError(message string, err error) *ServiceError {
	return &ServiceError{Code: "not_found", Message: message, Err: err}
}

func ConflictError(message string, err error) *ServiceError {
	return &ServiceError{Code: "conflict", Message: message, Err: err}
}

func InternalError(message string, err error) *ServiceError {
	return &ServiceError{Code: "internal_error", Message: message, Err: err}
}

func BadRequestError(message string, err error) *ServiceError {
	return &ServiceError{Code: "bad_request", Message: message, Err: err}
}

func ValidationError(message string) *ServiceError {
	return &ServiceError{Code: "bad_request", Message: message, Err: errors.New(message)}
}
