import * as React from "react";
import { useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, Button, Grid, Typography, Link } from "@mui/material";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import RHFCodes from "../../components/hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmail } from "../../redux/slices/auth";

// ----------------------------------------------------------------------

export default function VerifyForm() {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required("Code is required"),
    code2: Yup.string().required("Code is required"),
    code3: Yup.string().required("Code is required"),
    code4: Yup.string().required("Code is required"),
    code5: Yup.string().required("Code is required"),
    code6: Yup.string().required("Code is required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const [resendCount, setResendCount] = React.useState(1);
  const [isResendDisabled, setIsResendDisabled] = React.useState(false);
  const [countdown, setCountdown] = React.useState(30);
  const handleResendClick = () => {
    if (resendCount < 3) {
      setResendCount(resendCount + 1);
      startCountdown();
    }
  };
  const startCountdown = () => {
    setIsResendDisabled(true);
    let count = 30;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        setIsResendDisabled(false);
      }
    }, 1000);
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      //   Send API Request
      dispatch(
        VerifyEmail({
          email,
          otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFCodes
          keyName="code"
          inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
        />
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2">
              {!isResendDisabled
                ? `Didn't receive OTP code?`
                : `Resend in ${countdown} seconds`}
              {!isResendDisabled && (
                <Link href="#" onClick={handleResendClick}>
                  {" "}
                  Resend ({resendCount}/3)
                </Link>
              )}
            </Typography>
          </Grid>
        </Grid>
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "button.bgcolor",
            color: "button.color",
            "&:hover": {
              bgcolor: "button.hvbgcolor",
              color: "button.color"
            },
          }}
        >
          Submit
        </Button>
      </Stack>
    </FormProvider>
  );
}
