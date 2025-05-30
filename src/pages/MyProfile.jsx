import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const {
    userData,
    setUserData,
    handleSave,
    token,
    backendUrl,
    loadUserProfileData,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [about, setAbout] = useState(userData.about || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAbout(userData.about || "");
  }, [userData]);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const UpdateUserProfileData = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("about", about);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 mt-6">
      <div className="flex flex-col items-center gap-3">
        {isEdit ? (
          <label htmlFor="image">
            <div className="relative w-36 h-36 cursor-pointer rounded-full overflow-hidden hover:opacity-80">
              <img
                className="object-cover w-full h-full"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="profile"
              />
              {!image && (
                <img
                  className="absolute bottom-2 right-2 w-8"
                  src={assets.upload_icon}
                  alt="Upload"
                />
              )}
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : userData.image ? (
          <img
            className="w-36 h-36 object-cover rounded-full border"
            src={userData.image}
            alt="Profile"
          />
        ) : (
          <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {isEdit ? (
          <input
            className="text-center text-2xl font-semibold text-gray-800 border-b focus:outline-none"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="text-2xl font-semibold text-neutral-800">
            {userData.name}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-blue-500 mb-2 uppercase">
            Contact Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <div>
              <label className="block font-medium">Email:</label>
              <p className="text-blue-600">{userData.email}</p>
            </div>
            <div>
              <label className="block font-medium">Phone:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-100 px-3 py-1 rounded"
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Address:</label>
              {isEdit ? (
                <>
                  <input
                    className="w-full bg-gray-100 px-3 py-1 rounded mt-1"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={userData?.address?.line1 || ""}
                  />
                  <input
                    className="w-full bg-gray-100 px-3 py-1 rounded mt-1"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={userData?.address?.line2 || ""}
                  />
                </>
              ) : (
                <p>
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-blue-500 mb-2 uppercase">
            Basic Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <div>
              <label className="block font-medium">Gender:</label>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="bg-gray-100 px-3 py-1 rounded"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Date of Birth:</label>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="bg-gray-100 px-3 py-1 rounded"
                />
              ) : (
                <p>{userData.dob}</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <label className="block font-semibold text-blue-500 mb-2">
            About Patient
          </label>
          {isEdit ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-50"
              placeholder="Write about condition"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">{userData.about || "N/A"}</p>
          )}
        </section>

        <div className="text-center mt-6">
          {isEdit ? (
            <button
              onClick={UpdateUserProfileData}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Information"}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
