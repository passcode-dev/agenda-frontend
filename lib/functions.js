const handleLogout = () => {
    localStorage.removeItem("usuario")
    window.location.href = "/auth"
}
export { handleLogout }
