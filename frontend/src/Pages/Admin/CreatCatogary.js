import React, { useEffect, useState } from "react";
import AdminMenu from "../../Component/Layout/AdminMenu";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import CategoryForm from "../../Component/Form/CategoryForm.js";
import { Modal } from "antd";
import Layout from "../../Component/Layout/Layout";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const Token = localStorage.getItem("Token");
  const toast = useToast();

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        {
          name,
        },
        {
          headers: {
            authorization: Token,
          },
        }
      );
      if (data?.success) {
        toast({
          title: `${name} Category is Created`,
          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });
        getAllCategory();
        setName("");
      } else if (Array.isArray(data.message)) {
        // If data.message is an array of error messages
        data.message.forEach((errorMessage) => {
          toast({
            title: errorMessage,
            position: "top",
            isClosable: true,
            status: "error",
            duration: 5000,
          });
        });
      } else {
        toast({
          title: `${data.message}`,
          position: "top",
          isClosable: true,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong in creating category",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Somthing went wrong While Getting catogary",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName },
        {
          headers: {
            authorization: Token,
          },
        }
      );
      if (data?.success) {
        toast({
          title: `Catgaory is Updated from ${selected.name} to ${updatedName}`,
          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else if (data.message.issues) {
        toast({
          title: `${data.message.issues}`,
          position: "top",
          isClosable: true,
          status: "error",
          duration: 3000,
        });
      } else {
        toast({
          title: `${data.message}`,
          position: "top",
          isClosable: true,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong while updating category",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };
  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`,

        {
          headers: {
            authorization: Token,
          },
        }
      );
      if (data.success) {
        toast({
          title: `Catgaory is Deleted`,
          position: "top",
          isClosable: true,
          status: "success",
          duration: 3000,
        });

        getAllCategory();
      } else {
        toast({
          title: `${data.message}`,
          position: "top",
          isClosable: true,
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Somthing went wrong While deleting catogary",
        position: "top",
        isClosable: true,
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
