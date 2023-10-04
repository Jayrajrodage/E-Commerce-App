import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../GlobleState/Auth";
import { CartState, CartItemState } from "../GlobleState/Cart";
import { useToast } from "@chakra-ui/react";
import SearchInput from "../Form/SearchInput";
import useCategory from "../Hooks/useCategory";
const Header = () => {
  const setAuth = useSetRecoilState(authState);
  // const auth = useRecoilValue(authState);
  const CartItem = useRecoilValue(CartState);
  const setCartItem = useSetRecoilState(CartState);
  const setCartItemState = useSetRecoilState(CartItemState);
  const categories = useCategory();
  const toast = useToast();
  const [token, setToken] = useState("");
  const [user, setuser] = useState("");
  const [role, setRole] = useState();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    localStorage.removeItem("Role");
    setAuth();
    toast({
      title: "Logged Out successfully",
      position: "top",
      isClosable: true,
      status: "error",
      duration: 3000,
    });
  };
  useEffect(() => {
    const getvalues = () => {
      const Token = localStorage.getItem("Token");
      const User = localStorage.getItem("user");
      const Role = localStorage.getItem("Role");

      setToken(Token);
      setuser(User);
      setRole(Role);
    };
    getvalues();
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              🛒 E-Commerce App
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={"/categories"}>
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {!token ? (
                <>
                  {" "}
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                      {user?.split(" ")[0]}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${role == 1 ? `admin` : `user`}`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <li className="nav-item">
                <NavLink to="/Cart" className="nav-link">
                  Cart ({CartItem})
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
