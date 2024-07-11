import { Stack, Typography } from "@mui/material";
import React from "react";
import OTPForm from "../../sections/auth/OTPForm";
const OTP = () => {
    return (
        <>
            <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
                <Typography variant="h3" paragraph>
                    OTP Verify
                </Typography>
                <Typography sx={{ color: "tex.secondary", mb: 5 }}>
                  Enter OTP to reset your password
                </Typography>

            </Stack>
                
                {/* OTP Form */}
                <OTPForm />

          





        </>
    )
}
export default OTP;