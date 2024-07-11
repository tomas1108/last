import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  onBlur: PropTypes.func,
  sanitizeInputEnabled: PropTypes.bool, // Thêm prop mới để kiểm soát việc sử dụng hàm sanitizeInput
};

export default function RHFTextField({ name, helperText, onBlur, sanitizeInputEnabled = false, ...other }) {
  const { control, trigger } = useFormContext();

  const sanitizeInput = (value) => {
    // Chỉ cho phép các kí tự chữ cái và số, loại bỏ các kí tự đặc biệt
    return value.replace(/[^a-zA-Z\s]/g, '');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={sanitizeInputEnabled ? sanitizeInput(field.value) : field.value} // Kiểm tra xem có nên áp dụng hàm sanitizeInput hay không
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
