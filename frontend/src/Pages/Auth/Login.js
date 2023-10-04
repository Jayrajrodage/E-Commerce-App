import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import "../Styles/AuthStyles.css";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { authState } from "../../Component/GlobleState/Auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useSetRecoilState(authState);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        console.log(res.data);
        toast({
          title: `${res.data.message}`,

          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        console.log(res.data.user);
        localStorage.setItem("user", res.data.user.name);
        localStorage.setItem("Token", res.data.token);
        localStorage.setItem("Role", res.data.user.role);
        navigate(location.state || "/");
      } else {
        console.log(res.data.message);
        if (res.data.message === "Invalid Password") {
          toast({
            title: "Invalid Password",
            position: "top",
            isClosable: true,
            status: "error",
            duration: 3000,
          });
        }
        res?.data?.message.forEach((errorMessage) => {
          toast({
            title: errorMessage,
            position: "top",
            isClosable: true,
            status: "error",
            duration: 5000,
          });
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Somthing Went Wrong",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <Layout title="Login - Ecommerce App">
      <div className="form-container " style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN</h4>

          <div className="mb-3">
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn forgot-btn"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn forgot-btn"
              onClick={() => {
                navigate("/register");
              }}
            >
              Sign Up
            </button>
          </div>
          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
