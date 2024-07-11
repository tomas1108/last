import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Controller, useForm } from "react-hook-form";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import FormHelperText from '@mui/material/FormHelperText';
import {Link as RouterLink} from 'react-router-dom';

// import Countdown from 'react-countdown';
import { MuiOtpInput } from 'mui-one-time-password-input'



function matchIsNumeric(text) {
  const isNumber = typeof text === 'number'
  const isString = typeof text === 'string'
  return (isNumber || (isString && text !== '')) && !isNaN(Number(text))
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const OTPForm =() => {
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };
  const { control, handleSubmit } = useForm({
    defaultValues: {
      otp: ""
    }
  });

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

  const onSubmit = (data, event) => {
    event.preventDefault();

  };


  const validateChar = (value, index) => {
    return matchIsNumeric(value)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sx = {{ width: 400}} justifyContent="center">
              <Controller
                name="otp"
                control={control}
                rules={{ validate: (value) => value.length === 6 }}
                render={({ field, fieldState }) => (
                  <Box>
                    <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} validateChar={validateChar}/>
                    {fieldState.invalid ? (
                      <Alert sx={{mt: 3}} severity="error">OTP Invalid.</Alert>
                    ) : null}
                  </Box>
                )}
              />
              </Grid>
              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                <Typography variant="body2">
                  {!isResendDisabled ? (
                    `Didn't receive OTP code?`
                  ) : (
                    `Resend in ${countdown} seconds`
                  )}
                  {!isResendDisabled && (
                    <Link href="#" onClick={handleResendClick}> Resend ({resendCount}/3)</Link>
                  )}
                </Typography>
                </Grid>
              </Grid>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3, mb: 2, width: 100, position: 'text-center',
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
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/auth/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" sx={{mt: 1}}>
            
            </Grid>
          </Box>
        </Box>
    
      </Container>
    </ThemeProvider>
  );
}
export default OTPForm;