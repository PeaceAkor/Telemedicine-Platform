import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₦";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || false);
  console.log("Token in localStorage:", localStorage.getItem("token"));

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
    },
    gender: "",
    dob: "",
    image: "",
  });

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token directly
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const { data } = await axios.get(backendUrl + `/api/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phone", userData.phone);
    formData.append("dob", userData.dob);
    formData.append("gender", userData.gender);
    formData.append("address", JSON.stringify(userData.address));
    if (userData.image && typeof userData.image !== "string") {
      formData.append("image", userData.image);
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token directly
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.get(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        console.log("✅ Profile updated:", res.data.user);
        setIsEdit(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went");
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    setDoctors,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    handleSave,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
