import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
export default function PrivateRoute() {
  const [ok, setok] = useState(false);

  const token = localStorage.getItem("Token");
  useEffect(() => {
    const Authcheack = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user-auth`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.ok) {
        setok(true);
      } else {
        setok(false);
      }
    };
    if (token) Authcheack();
  }, [token]);
  return ok ? <Outlet /> : <Spinner />;
}
