import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMyLocation } from "../MapPage/mapSlice";
import { getFakeLocation } from "./FAKE_LOCATION";
import "./LoginPage.css";
import { connectWithSocketIOServer } from "../socketConnection/socketConnection";

export const LoginPage: FC = () => {
  const [userName, setUserName] = useState("");
  const [locationErrorOccurred] = useState(false);

  const myLocation = useAppSelector((state) => state.map.myLocation);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSuccess = (position: any) => {
    console.log(position);
    dispatch(
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitube,
      })
    );
  };

  // const onError = (error: any) => {
  //   console.log(error);
  //   setLocationErrorOccurred(true);
  // };

  // const locationOptions = {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  // };

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   onSuccess,
    //   onError,
    //   locationOptions
    // );
    onSuccess(getFakeLocation());
  }, []);

  useEffect(() => {
    if (myLocation) {
      connectWithSocketIOServer();
    }
  }, [myLocation]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const isUserNameValid = (value: string) => {
    return value.length > 0 && value.length < 10 && !value.includes(" ");
  };

  const handleLogin = () => {
    navigate("/map");
  };

  return (
    <div className="l_page_main_container">
      <div className="l_page_box">
        <p className="logo">GeoCall</p>

        <input
          className="l_page_input"
          value={userName}
          onChange={handleOnChange}
        />
        <button
          className="l_page_login_button"
          disabled={!isUserNameValid(userName) || locationErrorOccurred}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};
