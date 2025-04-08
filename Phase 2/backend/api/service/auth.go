package service

import (
	"M-AI/api/dto"
	"M-AI/api/model"
	"M-AI/api/repository"
	"M-AI/internal/config"
	"M-AI/pkg/auth"
	"M-AI/pkg/db"
	"errors"
	"gorm.io/gorm"
)

type AuthService struct {
	authRepo *repository.AuthRepository
	db       *gorm.DB
}

func NewAuthService(db *gorm.DB, authRepo *repository.AuthRepository) *AuthService {
	return &AuthService{authRepo: authRepo, db: db}
}
func (s *AuthService) SignUp(user *model.User) error {
	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		_, err := s.authRepo.GetUserByEmail(tx, user.Email)
		if err == nil {
			return BadRequestError("Email already exists", errors.New("email already exists"))
		}
		hashed, err := auth.HashPassword(user.Password, config.AppConfig.Auth.SecretKey, config.AppConfig.Auth.Salt)
		if err != nil {
			return BadRequestError("invalid password", err)
		}
		user.Password = hashed
		return s.authRepo.CreateUser(tx, user)
	})
	if err != nil {
		return InternalError("Failed to sign up", err)
	}
	return nil
}
func (s *AuthService) AuthenticateUser(email, password string) (dto.AuthUserDTO, error) {
	var result dto.AuthUserDTO

	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		user, err := s.authRepo.GetUserByEmail(tx, email)
		if err != nil {
			return err
		}

		if !auth.VerifyPassword(password, config.AppConfig.Auth.SecretKey, config.AppConfig.Auth.Salt, user.Password) {
			return BadRequestError("invalid credentials", errors.New("invalid credentials"))
		}

		result = dto.AuthUserDTO{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		}
		return nil
	})

	if err != nil {
		return result, InternalError("authentication failed", errors.New("authentication failed"))
	}
	return result, nil
}

func (s *AuthService) GetUserByID(userID uint) (model.User, error) {
	var result model.User
	err := db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		user, err := s.authRepo.GetUserByID(tx, userID)
		if err != nil {
			return err
		}
		result = user
		result.Password = ""
		return nil
	})
	if err != nil {
		return result, BadRequestError("User not found", err)
	}
	return result, nil
}

func (s *AuthService) ChangeUserName(userID uint, newName string) error {
	return db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		user, err := s.authRepo.GetUserByID(tx, userID)
		if err != nil {
			return err
		}
		user.Name = newName
		return tx.Save(user).Error
	})
}
func (s *AuthService) ChangeUserPassword(userID uint, oldPassword, newPassword string) error {
	return db.TransactionExecutor(s.db, func(tx *gorm.DB) error {
		user, err := s.authRepo.GetUserByIDWithPw(tx, userID)
		if err != nil {
			return err
		}
		if !auth.VerifyPassword(oldPassword, config.AppConfig.Auth.SecretKey, config.AppConfig.Auth.Salt, user.Password) {
			return BadRequestError("Incorrect old password", errors.New("wrong password"))
		}
		password, err := auth.HashPassword(newPassword, config.AppConfig.Auth.SecretKey, config.AppConfig.Auth.Salt)
		if err != nil {
			return InternalError("invalid password", err)
		}
		user.Password = password
		return tx.Save(user).Error
	})
}
