const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexUsername = /^[a-zA-Z0-9_]{3,20}$/;
const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const regexRg = /^\d{2}\.\d{3}\.\d{3}-\d{1}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const regexNome = /^[a-zA-ZÀ-ÿ]{2,}(?:\s[a-zA-ZÀ-ÿ]{2,})+$/;
const regexData = /^\d{4}-\d{2}-\d{2}$/;

export { regexEmail, regexUsername, regexCpf, regexRg, regexPassword, regexNome, regexData };