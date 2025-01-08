package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"agenda-backend/src/models"
	"agenda-backend/src/services"
	"agenda-backend/src/utils"
)

func AuthLogin(c *gin.Context) {
	var user models.User

	// Realiza o binding e validação inicial
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Response{
			Status:  "error",
			Message: "Invalid input",
			Data:    gin.H{"details": err.Error()},
		})
		return
	}

	// Chama o serviço para validar os campos de login
	if err := services.ValidateUserForLogin(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Response{
			Status:  "error",
			Message: "email or password invalid",
            Data:    gin.H{"details": err.Error()},
		})
		return
	}

    // Autentica o usuário
	authenticatedUser, err := services.AuthenticateUser(user.Email, user.Username, user.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.Response{
			Status:  "error",
			Message: err.Error(),
		})
		return
	}

	// Login bem-sucedido
	c.JSON(http.StatusOK, utils.Response{
		Status:  "success",
		Message: "Login successful",
		Data:    authenticatedUser,
	})
}
