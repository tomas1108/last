import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";

// @mui
import { Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
//
import AvatarPreview from "./preview/AvatarPreview";
import { Image } from "phosphor-react";

// ----------------------------------------------------------------------

const StyledDropZone = styled("div")(({ theme }) => ({
  width: 100, // Tăng kích thước chiều rộng
  height: 100, // Tăng kích thước chiều cao
  margin: "auto",
  display: "flex",
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "50%",
  alignItems: "center",
  position: "relative",
  justifyContent: "center",
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

const StyledPlaceholder = styled("div")(({ theme }) => ({
  zIndex: 7,
  position: "absolute",
  top: "50%", // Đặt vị trí ở giữa theo chiều dọc
  left: "50%", // Đặt vị trí ở giữa theo chiều ngang
  transform: "translate(-50%, -50%)", // Dịch chuyển về giữa
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%", // Sử dụng toàn bộ chiều rộng của parent
  height: "100%", // Sử dụng toàn bộ chiều cao của parent
  color: theme.palette.text.disabled,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

UploadGroupAvatar.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.node,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function UploadGroupAvatar({
  error,
  file,
  disabled,
  helperText,
  sx,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    multiple: false,
    disabled,
    ...other,
  });

  const hasFile = !!file;

  const isError = isDragReject || !!error;

  return (
    <>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            borderColor: "error.light",
            ...(hasFile && {
              bgcolor: "error.lighter",
            }),
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...(hasFile && {
            "&:hover": {
              "& .placeholder": {
                opacity: 1,
              },
            },
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        {hasFile && <AvatarPreview file={file} />}

        <StyledPlaceholder
          className="placeholder"
          sx={{
            "&:hover": {
              opacity: 0.72,
            },
            ...(hasFile && {
              zIndex: 9,
              opacity: 0,
              color: "common.white",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
            }),
            ...(isError && {
              color: "error.main",
              bgcolor: "error.lighter",
            }),
          }}
        >
          <Image />

          <Typography variant="caption">
            {file ? "Update photo" : "Upload photo"}
          </Typography>
        </StyledPlaceholder>
      </StyledDropZone>

      {helperText && helperText}
    </>
  );
}
