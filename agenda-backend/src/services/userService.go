package services

import (
	"golang.org/x/crypto/bcrypt"
    "agenda-backend/src/repository"
	"agenda-backend/src/models"
)

func CreatedUser(user *models.User) (bool, error) {
    err := HashPassword(user) 
    if err != nil {
        return false, err
    }

    err = repository.CreateUser(user) 
    if err != nil {
        if err.Error() == "email already in use" {
            return false, err
        }
        return false, err
    }

    return true, nil
}


// Gerar hash da senha
func HashPassword(u *models.User) error {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.Password = string(hashedPassword) 
    return nil
}

