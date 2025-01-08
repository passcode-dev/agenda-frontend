package routes

import (
    "agenda-backend/src/controllers"
    "github.com/gin-gonic/gin"
    "agenda-backend/src/utils"
)

func SetupRouter() *gin.Engine {
   
    router := gin.Default()
    router.Use(utils.CORSMiddleware())

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "testando",
		})
	})

    api := router.Group("/api")
    api.POST("/login", controllers.AuthLogin)

    api.POST("/users", controllers.CreateUser)
    
	/*api.POST("/users", controllers.CreateUser)
    api.Use(middlewares.AuthMiddleware())
    {
        api.GET("/current-key", controllers.GetCurrentKey)
        api.GET("/keys", controllers.ListKeys)

        api.GET("/users", controllers.ListUsers) 
        api.PUT("/users/:id", controllers.UpdateUser) 
        api.DELETE("/users/:id", controllers.DeleteUser) 

        api.POST("/decrypt", controllers.DecryptDocument) 
    }*/

    return router
}
