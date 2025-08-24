package utils

type Result struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func Success(data interface{}) Result {
	return Result{
		Code:    0,
		Message: "success",
		Data:    data,
	}
}

func Error(msg string) Result {
	return Result{
		Code:    -1,
		Message: msg,
	}
}
