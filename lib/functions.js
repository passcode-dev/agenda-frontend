const handleLogout = () => {
    localStorage.removeItem("usuario")
    window.location.href = "/"
}
export { handleLogout }
