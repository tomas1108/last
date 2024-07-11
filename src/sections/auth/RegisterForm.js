import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Stack, Alert, IconButton, InputAdornment, TextField, MenuItem } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { RegisterUser } from "../../redux/slices/auth";

export default function AuthRegisterForm() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [initialBirthDateValue, setInitialBirthDateValue] = useState('');
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name required"),
    lastName: Yup.string()

      .required("Last name required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
      birthDate: Yup.string()
      .required('Birth date is required')
      .test('has-changed', 'Birth date must be changed from the initial value', value => {
        if (initialBirthDateValue === '') {
          setInitialBirthDateValue(value); // Lưu giá trị ban đầu nếu chưa được đặt
          return true; // Giá trị chưa được thay đổi nên không báo lỗi
        }
        return value !== initialBirthDateValue; // Kiểm tra xem giá trị đã thay đổi hay chưa
      })


  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
    shouldUnregister: true, // Set shouldUnregister to true
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      dispatch(RegisterUser(data));
    } catch (error) {
      console.error(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };
  // Lấy ngày hiện tại và tạo giá trị tối đa cho thuộc tính max của input date
  const today = new Date();
  const maxDate = `${today.getFullYear() - 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} mb={4}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="firstName" label="First Name"  />

          {/* Sử dụng RHFTextField với sanitizeInputEnabled được tắt */}
          <RHFTextField name="lastName" label="Last Name" />
        </Stack>

        <RHFTextField name="email" label="Email address" blur />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            name="gender"
            label="Gender"
            value={methods.watch('gender') || ''}
            onChange={(e) => methods.setValue('gender', e.target.value)}
            fullWidth
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            name="birthDate"
            label="Birth Date"
            type="date"
            value={methods.watch('birthDate') || ''}
            onChange={(e) => methods.setValue('birthDate', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: maxDate,
            }}
          />
        </Stack>








        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          blur // Add blur attribute
        />
        <RHFTextField
          name="passwordConfirm"
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          blur // Add blur attribute
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
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
        Create Account
      </LoadingButton>
    </FormProvider>
  );
}
