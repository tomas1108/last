import React, { useCallback, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Avatar,
  Button,



  Stack,

} from "@mui/material";

import TextField from '@mui/material/TextField';
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";

import GenderSelection from "../../components/GenderSelection";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UpdatePassword from "../../sections/main/UpdatePassword";

const ProfileForm = () => {
  const LoginSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    // Validate gender , birthday
    // Chưa kiểm tra tồn tại trong hệ thống
  });

  const defaultValues = {
    name: "",
    about: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,

    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("avatarUrl", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    try {
      console.log("Data", data);
    } catch (error) {
      console.log(error);
      reset();
      setError("affterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={5}>
          <Stack
            sx={{ width: "100%" }}
            direction="column"
            alignItems={"center"}
          >
            <Avatar sx={{ height: 56, width: 56 }} />
          </Stack>
          <Stack spacing={3}>
            {!!errors.affterSubmit && (
              <Alert severity="error">{errors.affterSubmit.message}</Alert>
            )}
            <TextField
              id="name"
              label="Name"
              defaultValue="Nhật Nguyên"
              variant="standard"
              disabled // Tắt chỉnh sửa
            />
            <TextField
              id="email"
              label="Email"
              defaultValue="nguyendo76ngant@gmail.com"
              variant="standard"
              disabled // Tắt chỉnh sửa
            />
            <Stack spacing={4}>
              <GenderSelection disabled /> {/* Tắt chỉnh sửa */}
            </Stack>
          </Stack>
          <Stack spacing={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Choose your birthday" disabled /> {/* Tắt chỉnh sửa */}
            </LocalizationProvider>
          </Stack>

          <Stack
            spacing={2}
            // direction={"row"}
            justifyContent="space-between"
          >
            <Button
              color="primary"
              size="medium"
              variant="outlined"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Change Password
            </Button>
            <Button
              color="primary"
              size="medium"
              type="submit"
              variant="contained"
              disabled // Tắt chỉnh sửa
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
      {openDialog && (
        <UpdatePassword open={openDialog} handleClose={handleCloseDialog} />
      )}
     </>
  );
};
export default ProfileForm;