import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import { useLoginUserMutation, useSignUpUserMutation } from "../api/Api"; // Assuming RTK query is set
import { toast } from "react-toastify";
import Loader from "../components/loading/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginUser } from "../store/userSlice";


const inputStyle = {
  input: {
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 1,
  },
  label: { color: "#ccc" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
  },
};

const LoginSignUp = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    Avatar: null,
  });
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState(null);
  const [signupUserApi, signuUpResp] = useSignUpUserMutation();
  const [loginUserApi,loginUserResp] = useLoginUserMutation()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, Avatar: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("password", formData.password);
      form.append("avatar", formData.Avatar);
      try {
        const signupresp = await signupUserApi(form).unwrap();
        console.log(signupresp?.isError);
        if(signupresp?.isError){
          toast.error("failed")
        }
        if (signupresp?.success) {
          setFormData({ name: "", password: "", Avatar: null});
          toast.success("user created");
          
        }else{
          toast.error("user name exist");
        }
      } catch (err) {
        if(err){
          toast.error("failed to create")
        }
      }
    } else {
      const loginresp = await loginUserApi({
        name: formData.name,
        password: formData.password,
      })
      if(!loginresp?.data?.success)
      {
        toast.error("invalid credentials")
      }
      if(loginresp?.data?.success){
        toast.success("user login")
        navigate("/home")
      }
      console.log(loginresp);
      dispatch(setLoginUser(loginresp?.data?.user))
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({ name: "", password: "", Avatar: null });
    setImagePreview(null);
  };

  return (
    <>
      {
        <Box
          sx={{
            minHeight: "95vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "url(https://static.vecteezy.com/system/resources/previews/034/324/791/non_2x/dark-cave-game-background-tillable-horizontally-dark-terrible-empty-place-with-rock-lighting-walls-in-side-view-for-2d-games-location-illustration-vector.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            p: 2,
          }}
        >
          <Container maxWidth="xs">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                color: "#fff",
              }}
            >
              <Typography variant="h5" align="center" gutterBottom>
                {isSignup ? "Sign Up" : "Login"}
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 2 }}
              >
                {isSignup && (
                  <>
                    <Stack
                      direction="column"
                      alignItems="center"
                      spacing={1}
                      sx={{ mt: 2, mb: 1 }}
                    >
                      <Avatar
                        src={imagePreview}
                        sx={{ width: 72, height: 72, border: "2px solid #fff" }}
                      />
                      <Button
                        variant="outlined"
                        component="label"
                        color="secondary"
                        sx={{ color: "#fff", borderColor: "#ccc" }}
                      >
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    </Stack>
                  </>
                )}

                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={inputStyle}
                  InputLabelProps={{ shrink: true }}
                />

                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="contained" color="secondary" type="submit">
                    {isSignup
                      ? signuUpResp?.isLoading
                        ? "Uploading..."
                        : "Create Account"
                      : "Login"}
                  </Button>

                  <Button onClick={toggleMode} color="secondary">
                    {isSignup
                      ? "Already have an account? Login"
                      : "Don't have an account? Sign Up"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Container>
        </Box>
      }
    </>
  );
};

export default LoginSignUp;
