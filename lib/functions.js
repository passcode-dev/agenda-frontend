"use client"

const handleLogout = () => {
    localStorage.removeItem("usuario")
    document.cookie = "Authorization=; Max-Age=0; path=/;"  // Isso deve remover o cookie no caminho "/"
    window.location.href = "/"  // Redireciona para a página inicial
}

export { handleLogout }
