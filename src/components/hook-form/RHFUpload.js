import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar, UploadGroupAvatar } from '../upload';
import { useSelector } from 'react-redux';


// ----------------------------------------------------------------------



RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();
  const {user_avatar} = useSelector((state) => state.auth);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar
            accept={{
               'image/*': [] ,
            }}
            error={!!error}
            file={field.value || user_avatar} // Truyền giá trị của user_avatar vào file
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

export function RHFUploadGroupAvatar({ name, ...other }) {
  const { control } = useFormContext();
  const {group_current_conversation} = useSelector((state) => state.group);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadGroupAvatar
            accept={{
               'image/*': [] ,
            }}
            error={!!error}
            file={field.value || group_current_conversation.avatar} 
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadGroupAvatar.propTypes = {
  name: PropTypes.string,
};