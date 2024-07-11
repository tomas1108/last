import { Avatar, Container, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import avatar from "../../assets/Images/logo_main.png";
import { useScreenDetector } from "../../hooks/useScreenDectector";

// tạo hàm kiểm trả login 
const isAuthen = false; // true => đã login không ra trang login dc
                       // ngược lại ra trang login
const MainLayout = () => {
const {isLoggedIn} = useSelector((state) => state.auth);
const { isMobile, isTablet, isDesktop } = useScreenDetector();
  if(isLoggedIn){
    return <Navigate to="/app"></Navigate>
  }
  return (
    <>
      <Container sx={{textAlign: "center", width: '100%'}} maxWidth='sm'>
        <Stack {...(isTablet && { sx: { paddingTop: '10%' } })} spacing={4}>
          <Stack sx={{ width: "100%" }} direction="column" alignItems={"center"}>
            <Avatar sx={{ mt: 4, mb: 1, width: 56, height: 56}} src={avatar}></Avatar>
          </Stack>
        </Stack>
        <Outlet/>
      </Container>
    </>
  );
};

export default MainLayout;
