import React from "react";
import { Avatar, Box, Divider, Fade, Menu, MenuItem, Stack, Typography } from "@mui/material";


import { Profile_Menu } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slices/auth";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
/* import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config"; */

const ProfileMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const {user_avatar} = useSelector((state) => state.auth);
  const {user_name} = useSelector((state) => state.auth);
  const {user_id} = useSelector((state) => state.auth);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Avatar
        id="profile-positioned-button"
        aria-controls={openMenu ? "profile-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        alt={user_name}
        src={user_avatar}
        onClick={handleClick}
      />
      <Menu
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        TransitionComponent={Fade}
        id="profile-positioned-menu"
        aria-labelledby="profile-positioned-button"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
     
      >
        <Box p={1}  >
          <Stack spacing={1}>
            <Typography variant="subtitle1" textAlign={"center"} sx={{ fontWeight: 500 }} >
              {user_name}
            </Typography>
            <Divider  />
            {Profile_Menu.map((el, idx)  => (
              <MenuItem key={idx} onClick={handleClose}>
                <Stack
                  onClick={() => {
                    if(idx === 0) {
                      navigate("/profile");
                    }
                    else if(idx === 1) {
                      navigate("/settings");
                    }
                    else {
                      dispatch(LogoutUser());
                      socket.emit("end", {user_id});
                    }
                  }}
                  sx={{ width: 100 }}
                  direction="row"
                  alignItems={"center"}
                  justifyContent="space-between"
                >
                  <span>{el.title}</span>
                  {el.icon}
                </Stack>{" "}
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
