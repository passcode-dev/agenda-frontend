package utils

type Response struct {
    Status  string      `json:"status"` // "success" ou "error"
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"` // Dados opcionais, usado apenas para respostas de sucesso
}
