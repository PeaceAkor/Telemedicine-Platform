import React from "react";

const DoctorVideoCall = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <iframe
        allow="camera; microphone; fullscreen; display-capture"
        src="https://go-medlink.daily.co/medlinkroom"
        style={{
          width: "90%",
          height: "90%",
          border: "0",
          borderRadius: "10px",
        }}
        title="Video Chat"
      ></iframe>
    </div>
  );
};

export default DoctorVideoCall;
