import React from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Stack } from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { ForgotPassword } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";


const ResetPasswordForm = () => {
    const dispatch = useDispatch();

    const ResetpasswordSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Email must be a valid email address"),

    })

    const defaultValues = {
        email: "nguyendo76ngant@gmail.com",
    }

    const methods = useForm({
        resolver: yupResolver(ResetpasswordSchema),
        defaultValues,
    });

    const { reset, setError, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = methods;

    const onSubmit = async (data) => {
        try {
            
            
            dispatch(ForgotPassword(data));

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
            <Stack spacing={5}>
                {!!errors.affterSubmit && (<Alert security="error">{errors.affterSubmit.message}</Alert>)}
                <RHFTextField name="email" label="Email address">
                </RHFTextField>

                <Button fullWidth color="inherit" size="large" type="submit" variant="contained"
                    sx={{
                        mt: 1,
                        bgcolor: "button.bgcolor",
                        color: "button.color",
                        "&:hover": {
                          bgcolor: "button.hvbgcolor",
                          color: "button.color"
                        },
                      }}>
                    Send  
                </Button>


            </Stack>


        </FormProvider>
    )
}
export default ResetPasswordForm;