import VideoCall from "./VideoCall";
import ChatBox from "./ChatBox";

const ConsultationRoom = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="flex-1">
        <VideoCall />
      </div>
      <div className="w-full lg:w-[350px]">
        <ChatBox />
      </div>
    </div>
  );
};
