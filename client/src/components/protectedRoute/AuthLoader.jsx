import { useDispatch, useSelector } from "react-redux";
import { setLoginUser, setToken } from "../../store/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageSkeleton from "../skeleton/PageSkeleton";
import axios from "axios";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);  // 👈 loading state
  const [responseData, setResponseData] = useState(null); // 👈 user data state

  const loginUser = useSelector((state) => state.loginUser);
  const { userName } = loginUser || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://multiplayer-tik-tak-toe.onrender.com/api/v1/direct-login", {
          withCredentials: true,
        });
        setResponseData(res.data);
        dispatch(setLoginUser(res.data.loginUser));
        dispatch(setToken(res.data));
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (!userName && !isLoading) {
      navigate("/");
    }
  }, [userName, isLoading, navigate]);

  if (isLoading) return <PageSkeleton />;

  return <>{children}</>;
};

export default AuthLoader;
