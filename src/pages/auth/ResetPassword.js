import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import {Link as RouterLink} from 'react-router-dom';
import ResetPasswordForm from "../../sections/auth/ResetPasswordFormSent";
import { useScreenDetector } from "../../hooks/useScreenDectector";

const ResetPassword = ()=> {
    const { isMobile, isTablet, isDesktop } = useScreenDetector();
    return(
        <>
        <Stack spacing={3} sx={{mb: 5, position:"relative", paddingTop: '2%'}}>
            <Typography variant="h3" paragraph>
                Forgot your Password?
            </Typography>
            <Typography sx={{color:"tex.secondary",mb:5}}>
                Please enter the email address associated with your account and We
                will send email you a link to reset your password.
            </Typography>
            {/*  Reset Pass Form */}
            <ResetPasswordForm />

            <Link component={RouterLink} to="/auth/login" color="inherit" variant="subtitle2" sx={{mt: 3, mx:"auto",alignItems:"center",display:"inline-flex"}}>
                <CaretLeft />
                Return to sign in
            </Link>
        </Stack>
        </>

    )
}
export default ResetPassword;