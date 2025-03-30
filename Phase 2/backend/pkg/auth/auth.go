package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"golang.org/x/crypto/bcrypt"
	"log"
)

func hmacSHA256(password, secretKey, salt string) string {
	h := hmac.New(sha256.New, []byte(secretKey+salt))
	h.Write([]byte(password))
	return hex.EncodeToString(h.Sum(nil))
}

func HashPassword(password, secretKey, salt string) (string, error) {
	hashedInput := hmacSHA256(password, secretKey, salt)
	hash, err := bcrypt.GenerateFromPassword([]byte(hashedInput), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		return "", err
	}
	return string(hash), nil
}

func VerifyPassword(password, secretKey, salt, hashedPassword string) bool {
	hashedInput := hmacSHA256(password, secretKey, salt)
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(hashedInput))
	return err == nil
}
