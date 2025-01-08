package services

import (
	"errors"
	"agenda-backend/src/models"
	"agenda-backend/src/repository"

	"golang.org/x/crypto/bcrypt"
)

func ValidateUserForLogin(user *models.User) error {
	if user.Email == "" && user.Username == "" {
		return errors.New("either email or username must be provided")
	}
	return nil
}

func AuthenticateUser(email, username, password string) (map[string]interface{}, error) {
	var user *models.User
	var err error

	if email != "" {
		user, err = repository.GetUserByEmail(email)
	} else if username != "" {
		user, err = repository.GetUserByUsername(username)
	}

	if err != nil {
		if err.Error() == "record not found" {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	responseUser := map[string]interface{}{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	}

	return responseUser, nil
}
