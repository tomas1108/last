import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/slices/app";
import {
  FriendElement,
  FriendRequestElement,
  UserElement,
} from "../../components/UserElement";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTexField";
import { SimpleBarStyle } from "../../components/Scrollbar";
import  ScrollbarCustom  from "../../components/ScrollbarCustom"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ScrollbarNormal from "../../components/ScrollbarNormal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const user_id = localStorage.getItem("user_id");
const ResulSearchList = ({ search }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch(FetchUsers(user_id));
  }, [dispatch]);
  return (
    <>
      <Stack
        spacing={2}
        direction="column"
        sx={{ flexGrow: 1, height: "100%", overflowY: "auto" }}
      >
        <Stack spacing={2.4}>
          <Typography variant="subtitle2" sx={{ color: "#676767" }}>
            Recent search
          </Typography>
          <SimpleBarStyle>
            {search.toLowerCase() !== "" &&
              users
                .filter((item) => {
                  return item.email.toLowerCase().includes(search);
                })
                .map((el, idx) => {
                  return <UserElement key={idx} {...el} />;
                })}
          </SimpleBarStyle>
        </Stack>
        <Stack spacing={2.4}>
          {/* <Typography p={1} variant="subtitle2" sx={{ color: "#676767" }}>
              Recommended friends
            </Typography> */}
          {/* Duyệt result render element   */}
          {/* Vòng lặp ở đây */}
        </Stack>
      </Stack>
    </>
  );
};

const defaultValues = {
  email: "",
};

const SearchSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
});

const SearchForm = () => {
  const methods = useForm({
    // resolver: yupResolver(SearchSchema),
    // defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      /// hàm API toạ group
    } catch (error) {
      console.log("error", error);
    }
  };

  const [search, setSearch] = useState("");
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <RHFTextField
          name="email"
          label="Enter email"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <ResulSearchList search={search} />
      </Stack>
    </FormProvider>
  );
};
const UsersList = () => {


  return (
    <>
      <SearchForm></SearchForm>
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    dispatch(FetchFriends( user_id));
  }, [dispatch]);

  return (
    <>
    
    <ScrollbarNormal>
      {friends.map((el, idx) => {
        return <FriendElement key={idx} {...el} />;
     
      })}
         </ScrollbarNormal>
    </>
  );
};

const RequestsList = () => {
  const dispatch = useDispatch();
  const { friendRequests } = useSelector((state) => state.app);
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    dispatch(FetchFriendRequests(user_id));
  }, [dispatch] );
  if (!Array.isArray(friendRequests)) {
    return <div>Loading...</div>; // Hoặc bất kỳ chỉ báo tải nào khác
  }
  return (
    <>
      {friendRequests.map((el, idx) => {
        return <FriendRequestElement  key={idx} {...el} />;
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Search" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%", maxHeight: "400px", overflow: "hidden" }}>
          <Stack spacing={2.4}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <UsersList />;
                case 1: // display friends in this list
                  return <FriendsList />;
                case 2: // display request in this list
                  return <RequestsList />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
