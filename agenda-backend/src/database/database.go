package database

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"agenda-backend/src/models"
)

var DB *gorm.DB

func InitDB() {
	var err error

	// Carregar as variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, carregando variáveis de ambiente...")
	}

	// Acessar variáveis de ambiente
	dbConnection := os.Getenv("DB_CONNECTION")
	jwtSecret := os.Getenv("JWT_SECRET")

	log.Printf("Conexão com o banco de dados: %s", dbConnection)
	log.Printf("JWT Secret: %s", jwtSecret)

	// Implementação da lógica de Retry
	retries := 5
	for retries > 0 {
		DB, err = gorm.Open("mysql", "teste:1234@tcp(mysql-db)/mydatabase?charset=utf8mb4&parseTime=True&loc=Local")
		if err == nil && DB != nil {
			log.Println("Conexão com o banco de dados estabelecida.")
			break
		}

		log.Printf("Falha ao conectar ao banco de dados. Tentativas restantes: %d. Erro: %v\n", retries, err)
		retries--
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Panic("Erro ao conectar ao banco de dados após múltiplas tentativas:", err)
	}

	// Verificar se o ponteiro DB não é nulo
	if DB == nil {
		log.Panic("Erro ao inicializar o banco de dados: ponteiro nulo")
	}

	// Migrações automáticas
	if err = DB.AutoMigrate(
		&models.User{},
		/*&models.Student{},
		&models.Teacher{},
		&models.Class{},
		&models.Course{},
		&models.StudentHasClass{},
		&models.StudentHasCourse{},
		&models.TeacherHasCourse{},
		&models.TeacherHasClass{},*/
	).Error; err != nil {
		log.Panic("Erro ao criar as tabelas do banco de dados:", err)
	}
}

// JWTSecret exportado para uso em outras partes do código
var JWTSecret = os.Getenv("JWT_SECRET")
