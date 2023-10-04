import { Route, Routes } from "react-router-dom";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Policy from "./Pages/Policy";
import Pagenotfound from "./Pages/PageNotFound";
import HomePage from "./Pages/HomePage";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import DashBorad from "./Pages/User/DashBorad";
import PrivateRoute from "./Component/Route/PrivateRoute";
import ForgotPasssword from "./Pages/Auth/ForgotPassword";
import AdminPrivate from "./Component/Route/AdminPrivate";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreatCatogary from "./Pages/Admin/CreatCatogary";
import User from "./Pages/Admin/User";
import Order from "./Pages/User/Order";
import Profile from "./Pages/User/Profile";
import CreatProduct from "./Pages/Admin/CreatProduct";
import Products from "./Pages/Admin/Products";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import Search from "./Pages/Search";
import ProductDetails from "./Pages/ProductDetails";
import Categories from "./Pages/Categories";
import CategoryProduct from "./Pages/CategoryProduct";
import CartPage from "./Pages/CartPage";
import AdminOrders from "./Pages/Admin/AdminOrders";
function App() {
  return (
    <>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<DashBorad />} />
          <Route path="user/orders" element={<Order />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<AdminPrivate />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/create-category" element={<CreatCatogary />} />
          <Route path="admin/create-product" element={<CreatProduct />} />
          <Route path="admin/products" element={<Products />} />{" "}
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/users" element={<User />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/About" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
