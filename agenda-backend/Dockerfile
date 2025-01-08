FROM golang:1.22.2-alpine

WORKDIR /app

COPY agenda-backend/go.mod agenda-backend/go.sum ./
RUN go mod download

COPY agenda-backend .
RUN ls /app  # Verificar o conteúdo do diretório
RUN go build -o app .

CMD ["./app"]
