import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
import { useToast } from "@chakra-ui/react";
export default function AdminPrivate() {
  const [ok, setok] = useState(false);
  const token = localStorage.getItem("Token");
  const toast = useToast();
  useEffect(() => {
    const Authcheack = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res && res.data.ok) {
        setok(true);
      } else {
        toast({
          title: "You are Not Admin",
          position: "top",
          isClosable: true,
          status: "error",
          duration: 5000,
        });
        setok(false);
      }
    };
    if (token) Authcheack();
  }, [token]);
  return ok ? <Outlet /> : <Spinner path="" />;
}
