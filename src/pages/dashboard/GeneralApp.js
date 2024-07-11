import React, { useState, useEffect } from 'react';
/* import { useTheme } from "@mui/material/styles"; */
import { Box, Stack, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import ChatComponent from "./Conversation";
import Chats from "./Chats";
import Contact from "../../sections/Dashboard/Contact";

import { useSelector } from "react-redux";
import StarredMessages from "../../sections/Dashboard/StarredMessages";
import Media from "../../sections/Dashboard/SharedMessages";

import Pic1 from "../../assets/Images/pic1.png";
import Pic2 from "../../assets/Images/pic2.png";
import wellcome from "../../assets/Images/welcome.png";

const GeneralApp = () => {
 /*  const [searchParams] = useSearchParams();

  const theme = useTheme(); */

  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);


  const [imageIndex, setImageIndex] = useState(0);
  const images = [Pic1, Pic2, wellcome]; // Thay đổi đường dẫn đến hình ảnh tại đây

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Thay đổi hình sau mỗi 3 giây

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
            backgroundColor: "background.paper"
          
          }}
        >
          {chat_type === "individual" &&
            room_id !== null ? (
            <ChatComponent />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <Typography variant="h4">
                Welcome to PeachZy PC
              </Typography>
              <img src={images[imageIndex]} alt="Mô tả hình ảnh" />
              <Typography variant="subtitle2">
                Select a Conversation or start
                <Link > new one</Link>
              </Typography>

            </Stack>
          )}
        </Box>
        {sideBar.open &&
          (() => {
            switch (sideBar.type) {
              case "CONTACT":
                return <Contact />;

              case "STARRED":
                return <StarredMessages />;

              case "SHARED":
                return <Media />;

              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default GeneralApp;
