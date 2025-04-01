package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	Server struct {
		Port string `mapstructure:"port"`
	} `mapstructure:"server"`

	Database struct {
		Host     string `mapstructure:"host"`
		Port     int    `mapstructure:"port"`
		User     string `mapstructure:"user"`
		Password string `mapstructure:"password"`
		Name     string `mapstructure:"name"`
		Sslmode  string `mapstructure:"sslmode"`
	} `mapstructure:"database"`

	Auth struct {
		SecretKey string `mapstructure:"secret_key"`
		Salt      string `mapstructure:"salt"`
	}

	OpenAi struct {
		ApiKey string `mapstructure:"api_key"`
	}
}

var AppConfig Config

func LoadConfig(configPath string) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(configPath)
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Error unmarshaling config: %v", err)
	}

	log.Println("Configuration loaded successfully.")
}
