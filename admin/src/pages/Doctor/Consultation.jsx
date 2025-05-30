import React from "react";
import { useParams } from "react-router-dom";
import DoctorChatBox from "../../components/DoctorChatBox";
import DoctorVideoCall from "../../components/DoctorVideoCall";

const Consultation = () => {
  const { appointmentId } = useParams();
  const roomId = `consultation-${appointmentId}`;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Doctor-Patient Consultation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DoctorVideoCall roomId={roomId} />
        <DoctorChatBox roomId={roomId} />
      </div>
    </div>
  );
};

export default Consultation;
