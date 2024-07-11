import React, { useState } from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";
import { LoginUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { useScreenDetector } from "../../hooks/useScreenDectector";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [showPassWord, setShowPassword] = useState(false);
  const { isPhone678, isisMobile, isTablet, isDesktop } = useScreenDetector();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });
  const defaultValues = {
    email: "nguyendo76ngant@gmail.com",
    password: "123abcc",
  };
  // react hook form
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
      reset();
      setError("affterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.affterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <RHFTextField name="email" label="Email address"></RHFTextField>
        <RHFTextField
          name="password"
          label="Password"
          type={showPassWord ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassWord);
                  }}
                >
                  {showPassWord ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></RHFTextField>
      </Stack>
      <Grid container spacing={2} sx={{my: 2, mx: 0.1}} >
        <Grid sm={6} xs={12}>
          <Stack spacing={0.5} alignItems={isPhone678 ? "center" : "flex-start"}>
            <Typography variant="body2">New user? <Link to={"/auth/register"} component={RouterLink} variant="subtitle2">
              Create an account
            </Link> </Typography>
          </Stack>
        </Grid>
        <Grid sm={6} xs={12}>
          <Stack alignItems={isPhone678 ? "center" : "flex-end"}>
        <Link
          component={RouterLink}
          to="/auth/reset-password"
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot Password ?
        </Link>
      </Stack>
        </Grid>
      </Grid>
      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        sx={{
          mt: 1,
          bgcolor: "button.bgcolor",
          color: "button.color",
          "&:hover": {
            bgcolor: "button.hvbgcolor",
            color: "button.color"
          },
        }}
      >
        Login
      </Button>
    </FormProvider>
  );
};
export default LoginForm;
