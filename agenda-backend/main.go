package main

import (
	"agenda-backend/src/routes"
	"agenda-backend/src/database"
)

func main() {
	database.InitDB()
    router := routes.SetupRouter()
	router.Run(":8080")
}
