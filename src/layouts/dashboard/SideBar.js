import { Box, Stack, IconButton, Divider, Avatar, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Gear } from "phosphor-react";
import { Nav_Buttons, Profile_Menu } from "../../data";

import ava from "../../assets/Images/man.png";

import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";
import iconApp from "../../assets/Images/logo_main.png";

const getPath = (index) => {
  switch (index) {
    case 0:
      return "/app";

    case 1:
      return "/group";

    case 2:
      return "/call";

    case 3:
      return "/settings";

    default:
      break;
  }
}

const getMenuPath = (index) => {
  switch (index) {
    case 0:
      return "/profile";
    case 1:
      return "/settings";
    case 2:
      /// cập nhật token và đặt isAuthen = false 
      return "/auth/login";
    default:
      break;
  }

}

const SideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);


  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <Box p={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        height: "100vh",
        width: 100,
      }}
    >
      <Stack
        direction="column"
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ height: "100%" }}
        spacing={3}>
        <Stack alignItems={"center"} spacing={4}>
        <Avatar  size={20} src={iconApp} />
          <Stack
            sx={{ width: "max-content" }}
            direction={"column"}
            alignItems={"center"}
            spacing={3}>
            {Nav_Buttons.map((el, idx) => (
              el.index === selected ?
                <Box
                  key={idx}
                  p={1}
                  sx={{
                    backgroundColor: theme.palette.primary.darker,
                    borderRadius: 1.5,
                  }}
                >
                  <IconButton
                    sx={{ width: "max-content", color: "#fff" }}
                    key={el.index}
                  >
                    {el.icon}
                  </IconButton>
                </Box>
                : <IconButton
                  onClick={() => {
                    setSelected(el.index);
                    navigate(getPath(el.index));
                  }}
                  sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }}
                  key={el.index}
                >
                  {el.icon}
                </IconButton>

            ))}
            {/* tao layout phan cach */}
            <Divider sx={{ width: "48px" }} />
            {selected === 3 ? (
              <Box
                p={1}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1.5,
                }}
              >
                <IconButton sx={{ width: "max-content", color: "#fff" }}>
                  <Gear></Gear>
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => {
                  setSelected(3)
                  navigate(getPath(3));
                }}
                /* chuyển màu khi đổi theme  */
                sx={{ width: "max-content", color: theme.palette.mode === "light" ? "#000" : theme.palette.text.primary }}
              >
                <Gear></Gear>
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/*   tao nut chuyen theme */}
        <Stack spacing={4}>
        
          
        <Avatar id="basic-button" aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick} size={20} src={ava} /> 
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack spacing={1} px={1}>
              {Profile_Menu.map((el, idx) => (
                <MenuItem key={idx} onClick={() => {
                  handleClick();
                }}>
                  <Stack onClick={() => {
                    // nếu idx = 2 thì đăng xuất
                    if (idx === 2) {
                      dispatch(LogoutUser());
                    } else {
                      navigate(getMenuPath(idx));
                    }

                  }} sx={{ width: 100 }} direction="row" alignItems={"center"} justifyContent="space-between">
                    <span> {el.title}</span>
                    {el.icon}

                  </Stack>
                </MenuItem>

              ))}
            </Stack>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  )
}
export default SideBar