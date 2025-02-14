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

  value = value.replace(/\D/g, "");
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const maskRg = (value) => {
    if (!value) return "";
  
    // Remove qualquer coisa que não seja letra ou número
    value = value.replace(/[^a-zA-Z0-9]/g, "");
  
    // Limita o valor a 9 caracteres
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
  
    // Aplica a máscara considerando números e letras
    return value
      .replace(/([a-zA-Z0-9]{2})([a-zA-Z0-9]{1})/, "$1.$2")   // Formata os dois primeiros caracteres como XX.
      .replace(/([a-zA-Z0-9]{3})([a-zA-Z0-9]{1})/, "$1.$2")   // Formata os três próximos caracteres como XXX.
      .replace(/([a-zA-Z0-9]{3})([a-zA-Z0-9]{1})$/, "$1-$2");  // Formata os três próximos e o último como XXX-X
  };
  
  
  

export { maskPhone, maskCpf, maskRg };
