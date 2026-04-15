import { createContext, useContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState("");
  const [services,setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //function to store the token in local storage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  //   this is to get the value in either true or false in the original state of token
  let isLoggedIn = !!token;
  // console.log("token", token);
  // console.log("isLoggedin ", isLoggedIn);

  //   to check whether is loggedIn or not
  const LogoutUser = () => {
    setToken("");
    setUser("");
    return localStorage.removeItem("token");
  };

  // JWT authentication - To get the currently loggedIn user data
  
  const userAuthentication = async() => {
    try{
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method : "GET",
        headers: {
          Authorization:`Bearer ${token}`,
        }
      });
      if(response.ok){
        const data = await response.json();
        // console.log("user data", data.userData);
        setUser(data.userData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }catch(error){
      console.error("Error fetching user data");
    }
  }

  // to fetch services data from the database
  const getServices = async(search = "", category = "") => {
    try {
      let url = "http://localhost:5000/api/data/service";
      const params = new URLSearchParams();
      
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);
      
      if (params.toString()) {
          url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
      });

      if(response.ok){
        const data = await response.json();
        setServices(data.msg);
      }
    
    } catch (error) {
      console.log(`Services frontend error: ${error}`);
    }
  }


  useEffect(() => {
    if (token) {
      userAuthentication();
    }
  }, [token]);

  useEffect(() => {
    getServices();
  }, []);

  const authorizationToken = `Bearer ${token}`;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, services, getServices, authorizationToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};