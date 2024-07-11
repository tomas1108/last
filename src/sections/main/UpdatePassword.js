import React, { useState } from "react";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
} from "@mui/material";
import { Eye, EyeSlash } from "phosphor-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import { ChangePassowrd } from "../../redux/slices/auth";

import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ChangePasswordForm = ({ handleClose }) => {
  const dispatch = useDispatch();
  const NewGroupSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const defaultValues = {
    title: "",

    tags: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      dispatch(ChangePassowrd(data));
    } catch (error) {
      console.log(error);
      reset();
      setError("affterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };
  const [showPassWord, setShowPassword] = useState(false);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="currentPassword"
          label="Your current password"
          
        />
        <RHFTextField name="newPassword" label="New password" 
        type={showPassWord ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassWord);
                }}
              >
                {showPassWord ? <Eye /> : <EyeSlash />}
              </IconButton>
            </InputAdornment>
          ),
        }}/>
        <RHFTextField name="confirmPassword" label="Confirm new password"
        type={showPassWord ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassWord);
                }}
              >
                {showPassWord ? <Eye /> : <EyeSlash />}
              </IconButton>
            </InputAdornment>
          ),
        }}/>
        <Stack
          spacing={2}
          direction={"row"}
          alignItems="center"
          justifyContent={"end"}
        >
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          <Button type="submit" variant="contained">
            Confirm
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const UpdatePassword = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogContent sx={{ mt: 3 }}>
        {/* Create Group Form */}
        <ChangePasswordForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePassword;
