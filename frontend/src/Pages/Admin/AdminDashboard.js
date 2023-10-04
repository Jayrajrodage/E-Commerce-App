import React from "react";
import { authState } from "../../Component/GlobleState/Auth";
import { useRecoilValue } from "recoil";
import Layout from "../../Component/Layout/Layout";
import AdminMenu from "../../Component/Layout/AdminMenu";

const AdminDashboard = () => {
  const auth = useRecoilValue(authState);
  return (
    <Layout title={"Admin Dashboard"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> Admin Name : {auth?.user?.name}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
