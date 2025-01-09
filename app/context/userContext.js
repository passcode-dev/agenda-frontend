const { createContext, useState } = require("react");

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const storedUser = localStorage.getItem("usuario");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};