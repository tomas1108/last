import React, { useState, useEffect } from 'react';
/* import { useTheme } from "@mui/material/styles"; */
import { Box, Stack, Typography } from "@mui/material";

import { Link } from "react-router-dom";

import Groups from '../../pages/dashboard/Groups';
import GroupChatComponent  from './GroupConversation';
import GroupContact from "../../sections/Dashboard/group/GroupContact";
import GroupMembers from "../../sections/Dashboard/group/GroupMembers";
import { useSelector, useDispatch } from "react-redux";



import Pic1 from "../../assets/Images/pic1.png";
import Pic2 from "../../assets/Images/pic2.png";
import wellcome from "../../assets/Images/welcome.png";


const GeneralGroup = () => {
 /*  const [searchParams] = useSearchParams();
  
  const theme = useTheme(); */
  // const dispatch = useDispatch();
  // useEffect(() => {

  // }, [dispatch]);
  // const { sideBarGroup } = useSelector((state) => state.app);
  const { group_current_conversation, sidebar } = useSelector((state) => state.group);

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
        <Groups />
        <Box
          sx={{
            height: "100%",
            width: sidebar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
            backgroundColor: "background.paper"
          }}
        >
          {group_current_conversation !== null ? (
            <GroupChatComponent />
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
        {sidebar.open &&
          (() => {
            switch (sidebar.type) {
              case "CONTACT":
                return <GroupContact />;
              case "MEMBERS":
                return <GroupMembers />
              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default GeneralGroup;
