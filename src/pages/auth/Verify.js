import { Stack, Typography, Link } from "@mui/material";
import React from "react";
import VerifyForm from "../../sections/auth/VerifyForm";
import {Link as RouterLink} from 'react-router-dom';
import { CaretLeft } from "phosphor-react";
const Verify = () => {

    return(
        <>
        <Stack spacing={2} sx={{mb:3, position:"relative"}}>
            <Typography variant="h4">Please Verify OTP</Typography>
        </Stack>
        <VerifyForm />
        
        
        <Link component={RouterLink} to="/auth/login" color="inherit" variant="subtitle2" sx={{mt: 3, mx:"auto",alignItems:"center",display:"inline-flex"}}>
            <CaretLeft />
                Return to sign in
        </Link>
        </>
    )
}
export default Verify;