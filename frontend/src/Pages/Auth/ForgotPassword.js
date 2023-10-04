import React, { useState } from "react";
import Layout from "../../Component/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import "../../Pages/Styles/AuthStyles.css";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [Newpassword, setNewpassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        {
          email,
          answer,
          Newpassword,
        }
      );
      if (res && res.data.success) {
        toast({
          title: `${res.data.message}`,
          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });
        navigate("/");
      } else {
        if (res.data.message === "Wrong Email or Answer") {
          toast({
            title: "Wrong Email or Answer",
            position: "top",
            isClosable: true,
            status: "error",
            duration: 3000,
          });
        }
        res.data.message.forEach((errorMessage) => {
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
    <Layout title={"Forgot Password - Ecommerce APP"}>
      <div className="form-container ">
        <form onSubmit={handleSubmit}>
          <h4 className="title">RESET PASSWORD</h4>

          <div className="mb-3">
            <input
              type="email"
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
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toLowerCase())}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your favorite Sport Name "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={Newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your New Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            RESET
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;
