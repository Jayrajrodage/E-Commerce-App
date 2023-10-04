import React, { useState, useEffect } from "react";
import UserMenu from "../../Component/Layout/UserMenu";
import Layout from "../../Component/Layout/Layout";
import { authState } from "../../Component/GlobleState/Auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useToast } from "@chakra-ui/react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axios from "axios";
const Profile = () => {
  //context
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const toast = useToast();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    const password = auth?.password;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
    setPassword(password);
  }, [auth?.user, auth?.password]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Token")}`,
          },
        }
      );
      if (data?.errro) {
        console.log(data?.errro);
        toast({
          title: "Somthing Went wrong while updating Profile Information",
          position: "top",
          isClosable: true,
          status: "error",
          duration: 3000,
        });
      } else {
        setAuth({ ...auth, user: data?.updatedUser, password: data?.password });
        toast({
          title: "Profile Updated Successfully",
          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Somthing Went wrong while updating Profile Information",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "-40px" }}>
              <form onSubmit={handleSubmit}>
                <h4 className="title">USER PROFILE</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Email "
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Enter Your Password"
                    />
                    <div
                      style={{ marginTop: "15px" }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Phone"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputAddess"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
