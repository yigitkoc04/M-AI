package repository

import (
	"M-AI/api/model"
	"errors"
	"gorm.io/gorm"
)

type AuthRepository struct {
}

func NewAuthRepository() *AuthRepository {
	return &AuthRepository{}
}

func (r *AuthRepository) CreateUser(db *gorm.DB, user *model.User) error {
	return db.Create(user).Error
}

func (r *AuthRepository) GetUserByEmail(db *gorm.DB, email string) (model.User, error) {
	var user model.User
	err := db.Where("email = ? AND deleted_at IS NULL", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.User{}, errors.New("user not found")
		}
		return model.User{}, err
	}
	return user, nil
}

func (r *AuthRepository) GetUserByID(db *gorm.DB, userID uint) (model.User, error) {
	var userDTO model.User
	err := db.Model(&model.User{}).
		Select("id, name, email, password").
		Where("id = ? AND deleted_at IS NULL", userID).
		First(&userDTO).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.User{}, errors.New("user not found")
		}
		return model.User{}, err
	}
	return userDTO, nil
}

func (r *AuthRepository) GetUserByIDWithPw(db *gorm.DB, userID uint) (model.User, error) {
	var user model.User
	err := db.Model(&model.User{}).
		Select("*").
		Where("id = ? AND deleted_at IS NULL", userID).
		First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.User{}, errors.New("user not found")
		}
		return model.User{}, err
	}
	return user, nil
}
