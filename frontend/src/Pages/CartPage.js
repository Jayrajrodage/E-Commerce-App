import React, { useState, useEffect } from "react";
import Layout from "../Component/Layout/Layout";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CartItemState, CartState } from "../Component/GlobleState/Cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

import "../Pages/Styles/CartStyles.css";
import { authState } from "../Component/GlobleState/Auth";

const CartPage = () => {
  const setCartItem = useSetRecoilState(CartItemState);
  const CartItem = useRecoilValue(CartItemState);
  const setCartCount = useSetRecoilState(CartState);
  const CartCount = useRecoilValue(CartItemState);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const auth = useRecoilValue(authState);
  const token = localStorage.getItem("Token");
  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      CartItem?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...CartItem];

      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCartItem(myCart);
      setCartCount((count) => count - 1);
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart: CartItem,
        },
        {
          headers: {
            Authorization: `${auth?.token}`,
          },
        }
      );
      console.log(data);
      setLoading(false);
      setCartItem([]);
      setCartCount(0);
      navigate("/dashboard/user/orders");
      toast({
        title: "Payment Completed Successfully",
        position: "top",
        isClosable: true,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {CartItem?.length
                  ? `You Have ${CartItem.length} items in your cart ${
                      token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7 p-0 m-0">
              {CartItem?.map((p) => (
                <div
                  className="row medium-large-screen"
                  key={p._id}
                  style={{
                    marginBottom: "10px", // Add margin between product items
                    padding: "10px", // Add padding to each product item
                    backgroundColor: "#f7f7f7", // Add a background color to product items
                  }}
                >
                  {/* Your product item */}
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      style={{
                        maxWidth: "100%",
                        height: "130px",
                        width: "auto",
                      }}
                      className="card-img-top img-fluid"
                      alt={p.name}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price: {p.price} $</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.adddress ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.adddress}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2 " style={{ marginLeft: "15px" }}>
                {!clientToken || !auth?.token || !CartItem?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.adddress}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
