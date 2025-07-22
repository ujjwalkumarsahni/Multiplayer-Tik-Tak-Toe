import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDirectLoginQuery } from "../../api/Api";
import { useDispatch } from "react-redux";
import { setLoginUser } from "../../store/userSlice";
import Loader from "../loader/Loader";

export const ValidateUser = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useDirectLoginQuery();

  useEffect(() => {
    if (data?.loginUser) {
      dispatch(setLoginUser(data.loginUser));
      navigate("/home"); 
    }
  }, [data, dispatch, navigate]);

  if (isLoading) return <Loader/>;

  return children;
};
