const maskPhone = (value) => {
    if (!value) return "";
    return value
        .replace(/\D/g, "") // Remove caracteres não numéricos
        .replace(/^(\d{2})(\d)/, "+$1 ($2") // Adiciona o código do país e abre o parêntese do DDD
        .replace(/(\d{2})(\d)/, "$1) $2") // Fecha o parêntese do DDD
        .replace(/(\d{5})(\d)/, "$1-$2") // Adiciona o traço após os primeiros 5 dígitos do número
        .slice(0, 19); // Limita o tamanho da string a 15 caracteres
};

const maskCpf = (value) => {
    if (!value) return ""; 
    return value
        .replace(/\D/g, "") 
        .replace(/(\d{3})(\d)/, "$1.$2") 
        .replace(/(\d{3})(\d)/, "$1.$2") 
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2") 
        .slice(0, 14); 
};

const maskRg = (value) => {
    if (!value) return ""; 
    return value
        .replace(/\D/g, "") 
        .replace(/(\d{2})(\d)/, "$1.$2") 
        .replace(/(\d{3})(\d)/, "$1.$2") 
        .replace(/(\d{3})(\d{1})$/, "$1-$2") 
        .slice(0, 12); 
};

export { maskPhone, maskCpf, maskRg };
