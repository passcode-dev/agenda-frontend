package repository

import (
	"errors"
	"agenda-backend/src/database"
	"agenda-backend/src/models"
	"github.com/jinzhu/gorm"
)


func VerifyUserCreated(email string) (bool, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}


func CreateUser(user *models.User) error {
	
	exists, err := VerifyUserCreated(user.Email)
	if err != nil {
		return err 
	}

	if exists {
		return errors.New("email already in use") 
	}

	if err := database.DB.Create(user).Error; err != nil {
		return err
	}

	return nil
}