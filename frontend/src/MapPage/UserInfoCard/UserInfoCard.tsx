import { useSelector } from "react-redux";

import { ActionButtons } from "./ActionButtons";
import { calculateDistanceBetweenCoords } from "../../utils/location";

const Label = ({ fontSize, text }: { fontSize: string; text: string }) => {
  return (
    <p className="map_page_card_label" style={{ fontSize }}>
      {text}
    </p>
  );
};

export const UserInfoCard = ({
  username,
  userLocation,
  socketId,
}: {
  username: string;
  userLocation: string;
  socketId: string;
}) => {
  const myLocation = useSelector((state) => state.map.myLocation);

  return (
    <div className="map_page_card_container">
      <Label text={username} fontSize="16px" />
      <Label
        fontSize="14px"
        text={`${calculateDistanceBetweenCoords(myLocation, userLocation)}km`}
      />
      <ActionButtons socketId={socketId} username={username} />
    </div>
  );
};
