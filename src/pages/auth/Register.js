
import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import RegisterForm from "../../sections/auth/RegisterForm";
import { useScreenDetector } from "../../hooks/useScreenDectector";
const Register = () => {
    const { isPhone678, isisMobile, isTablet, isDesktop } = useScreenDetector();
    return (
        <>
            <Stack spacing={2} sx={{ mb: 5, position: "relative", ...(isTablet && { paddingBottom: 6 }) } }>

                <Typography variant='h4'>
                    Get Stated With PeachZy
                </Typography>

                <Stack direction={"row"} spacing={0.5}>
                    <Typography variant="body2"> Already have an account?</Typography>

                    <Link component={RouterLink} to="/auth/login" variant="subtitle2">
                        Sign In
                    </Link>
                </Stack>

                {/* Register Form */}
                <RegisterForm />


                <Typography component={"div"} 
                sx={{ color: "text.secondary", 
                mt: 3, 
                typography: "caption", 
                textAlign: "center", 
                }}
                >
                    {"By siging up, I agree to "}
                    <Link underline="always" color="text.peach">
                         Terms of service
                    </Link>
                    {"  and  "}
                    <Link underline="always" color="text.peach">
                         Privacy Policy
                    </Link>
                    .

                </Typography>

            </Stack>
        </>

    )
}
export default Register;