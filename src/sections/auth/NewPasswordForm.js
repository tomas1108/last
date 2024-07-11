import React, { useState } from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { Link as RouterLink, useSearchParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { NewPassword } from "../../redux/slices/auth";

const NewPasswordForm = () => {

    const dispatch = useDispatch();
    const [queryParameters] = useSearchParams();

    const [showPassWord, setShowPassword] = useState(false);
    const NewPasswordSchema = Yup.object().shape({
   
        password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
        passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    })

    const defaultValues = {
        password: "",
        passwordConfirm:"",
    };

    const methods = useForm({
        resolver: yupResolver(NewPasswordSchema),
        defaultValues,
    });

    const { reset, setError, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = methods;

    const onSubmit = async (data) => {
        try {
            dispatch(NewPassword({...data, token:queryParameters.get("token")}));





        } catch (error) {
            console.log(error);
            reset();
            setError("affterSubmit", {
                ...error,
                message: error.message,
            });

        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

            <Stack spacing={3}>
                {!!errors.affterSubmit && (<Alert security="error">{errors.affterSubmit.message}</Alert>)}
             
                <RHFTextField name="password" label="New Password" type={showPassWord ? "text" : "password"} InputProps={{
                    endAdornment: (
                        <InputAdornment>
                            <IconButton onClick={() => {
                                setShowPassword(!showPassWord)
                            }}>
                                {showPassWord ? <Eye /> : <EyeSlash />}
                            </IconButton>
                        </InputAdornment>
                    )
                }} >
                </RHFTextField>
                <RHFTextField name="passwordConfirm" type={showPassWord ? "text" : "password"} label="Confirm Password" >
                </RHFTextField>
                <Button fullWidth color="inherit" size="large" type="submit" variant="contained"
                sx={{
                    bgcolor: "button.bgcolor",
                    color: (theme) =>
                      theme.palette.mode === "light" ? "button.color" : "button.color",
                    "&:hover": {
                      bgcolor: "button.hvbgcolor",
                      color: (theme) =>
                        theme.palette.mode === "light" ? "button.color" : "button.color",
                    },
                    mt: 1,
                  }}
                  >
                Submit
            </Button>
            </Stack>
        </FormProvider>
    )
}
export default NewPasswordForm;