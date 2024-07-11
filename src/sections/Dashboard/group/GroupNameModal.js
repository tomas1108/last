import React, { useState, useCallback } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import S3 from "../../../utils/s3";
import FormProvider from "../../../components/hook-form/FormProvider";
import { RHFUploadGroupAvatar } from "../../../components/hook-form";
const GroupNameModal = ({ open, onClose, currentName, avatar }) => {
  const [newName, setNewName] = useState(currentName);
  const [file, setFile] = useState();
  const methods = useForm({});

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleUpdateImage = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("avatar", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const generateFileName = (file) => {
    // Lấy ngày giờ hiện tại
    const timeStamp = Date.now();
    // Kết hợp tên người dùng, ngày giờ và tên file để tạo tên file mới
    return `image_${timeStamp}_${file.name}`;
  };

  const updateGroupAvatar = async (data) => {
    try {
      console.log("DATA", data);
      const key = generateFileName(file);
      const imageUrl = await uploadFileToS3(file, key);
      // dispatch(
      //   UpdateUserProfile( user_id,
      //     {
      //     firstName: data?.name,
      //     avatar: imageUrl, // Sử dụng URL ảnh trả về từ S3
      //   })
      // );
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFileToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-image-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSave = () => {
    // Thực hiện logic lưu tên mới ở đây
    console.log("Tên mới:", newName);
    onClose();
  };

  const handleClose = () => {
    onClose();
    // Đặt lại tên mới về tên hiện tại của nhóm nếu người dùng hủy bỏ
    setNewName(currentName);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Change group name
        <Divider sx={{ mt: 2 }} />
      </DialogTitle>

      <DialogContent sx={{ width: "100%", mt: 5 }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}
          fullWidth
        >
          <Stack>
            <FormProvider methods={methods} onSubmit={updateGroupAvatar}>
              <RHFUploadGroupAvatar
                name="avatar"
                maxSize={314572}
                onDrop={handleUpdateImage}
              />
            </FormProvider>
          </Stack>
          <Stack>
            <TextField
              sx={{ width: 350 }} // Set chiều rộng của TextField là 100%
              label="Tên Nhóm"
              value={newName}
              onChange={handleNameChange}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupNameModal;
