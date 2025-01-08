package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Permitir origem específica
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // Métodos permitidos
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // Cabeçalhos permitidos
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true") // Permitir credenciais

		// Se for uma requisição preflight (OPTIONS), apenas retorne status 200
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}
