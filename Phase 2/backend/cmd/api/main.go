package main

import (
	"M-AI/api"
	"M-AI/internal/config"
	"M-AI/pkg/db"
	"fmt"
	"log"
)

func main() {
	config.LoadConfig("./internal/config")
	db.InitDB()

	fmt.Printf("Server will run on port: %s\n", config.AppConfig.Server.Port)
	fmt.Printf("Database host: %s, port: %db\n",
		config.AppConfig.Database.Host, config.AppConfig.Database.Port)

	router := api.InitRouter(db.DB)
	log.Printf("Starting server on port %s...", config.AppConfig.Server.Port)
	if err := router.Run(config.AppConfig.Server.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
