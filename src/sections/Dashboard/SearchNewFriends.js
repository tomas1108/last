import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Box,
  Badge,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { SimpleBarStyle } from "../../components/Scrollbar";
import React, { useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* const {email} = window.localStorage.getItem("email"); */

// Backend xu ly trả kq vô cho component này
const ResulSearchList = (result) => {
  return (
    <>
      <Stack
        spacing={2}
        direction="column"
        sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}
      >
        <SimpleBarStyle autoHide={true} timeout={500} clickOnTrack={false}>
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Recent search
            </Typography>
            {/* Duyệt result render element  */}
            {/* Vòng lặp ở đây */}
            <ProfileElement
              name="Lộc nhóm trưởng"
              email="lockutepo@gmail.com"
            ></ProfileElement>
          </Stack>
          <Stack spacing={2.4}>
            <Typography p={1} variant="subtitle2" sx={{ color: "#676767" }}>
            Recommended friends 
            </Typography>
            {/* Duyệt result render element   */}
            {/* Vòng lặp ở đây */}
            <ProfileElement
              name="Mark Zuckerberg"
              email="markcutebeauty@gmail.com"
            ></ProfileElement>
            <ProfileElement
              name="Barack Obama"
              email="ilovebunchathitnuong@gmail.com"
            ></ProfileElement>
            <ProfileElement
              name="Rose BlackPink"
              email="hoahongnaomachangcogai@gmail.com"
            ></ProfileElement>
            <ProfileElement
              name="Xuân tóc đỏ"
              email="ryderrapvietmuaba@gmail.com"
            ></ProfileElement>
          </Stack>
        </SimpleBarStyle>
      </Stack>
    </>
  );
};

const ResultContainer = styled("div")(({ theme }) => ({
  height: "300px" /* Đặt kích thước cố định của khu vực */,
  maxHeight: "300px" /* Đặt kích thước tối đa của khu vực */,
  overflowY: "auto" /* Hiển thị thanh cuộn theo chiều dọc khi cần */,
}));

const ProfileElement = ({ id, name, img, msg, email }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <Avatar src={img}></Avatar>
          {/* tao css online */}

          <Stack spacing={0.4}>
            <Typography variant="subtitle2">{name}</Typography>{" "}
            {/*  layout tên user */}
            <Typography variant="caption"> {email}</Typography>{" "}
            {/* layout tin nhắn  */}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

const CreateGroupForm = ({ handleClose }) => {
  const NewGroupSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      /// hàm API toạ group
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField  name="email" label="Enter email" />
        <ResultContainer>
          <ResulSearchList></ResulSearchList>
        </ResultContainer>

        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const SearchNewFriends = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      spacing= {2}
      sx={{ p: 4 }}
    >
    
      <DialogContent>
        {/* Form */}
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};
export default SearchNewFriends;
