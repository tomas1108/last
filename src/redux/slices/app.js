import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import S3 from "../../utils/s3";
import { v4 } from "uuid";
import { S3_BUCKET_NAME } from "../../config";


 // ----------------------------------------------------------------------


const initialState = {
  user: {
    name : null,
    email : null,
    avatar : null,
   
  },
  sideBar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  isLoggedIn: true,
  tab: 0, // [0, 1, 2, 3]
  snackbar: {
    open: null,
    severity: null,
    message: null,
  },
  users: [], // all users of app who are not friends and not requested yet
  all_users: [],
  friends: [], // all friends
  friendRequests: [], // all friend requests
  chat_type: null,
  room_id: null,
  call_logs: [],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchCallLogs(state, action) {
      state.call_logs = action.payload.call_logs;
    },
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },
    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    },

    openSnackBar(state, action) {
      console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
 
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;

    },
    updateAllUsers(state, action) {
      state.all_users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;

    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar =
  ({ severity, message }) =>
  async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackBar({
        message,
        severity,
      })
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };


  export const showSnackbarTop = ({ severity, message }) => async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackBar({
        message,
        severity,
        anchorOrigin: { vertical: 'top', horizontal: 'right' }, // Đặt anchorOrigin
      })
    );
  
    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };
  

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSideBarType({ type }));
  };
}
export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateTab(tab));
  };
}



export function FetchUsers(user_id) {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-users",
        {
          params: { _id: user_id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateUsers({ users: response.data.data }));
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );

        console.log(getState().app.users); // Kiểm tra giá trị friendRequests sau khi đã cập nhật
      })
      .catch(function (error) {
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));

      
      });
  };
}
/* export function FetchAllUsers() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-all-verified-users",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
} */
export function FetchFriends(user_id) {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-friends",
        {
          params: { _id: user_id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);

        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
        dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
export function FetchFriendRequests(user_id) {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-requests",
        
        {
          params: { _id: user_id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateFriendRequests({ requests: response.data.data })
        );
        console.log(getState().app.friendRequests); // Kiểm tra giá trị friendRequests sau khi đã cập nhật
      })
      .catch((err) => {
        console.log(err);
      });
  };
}


export const SelectConversation = ({ room_id }) => {
  
  return async (dispatch, getState) => {
      dispatch(slice.actions.selectConversation({ room_id }));
    
  };
};

export const FetchCallLogs = () => {
  return async (dispatch, getState) => {
    axios
      .get("/user/get-call-logs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.fetchCallLogs({ call_logs: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};


//   return async (dispatch, getState) => {
//     const file = formValues.avatar;
//     console.log("File", file);

//     try {
//       const presignedURL = await new Promise((resolve, reject) => {
//         S3.getSignedUrl(
//           'putObject',
//           {
//             Bucket: "chat-app-image-cnm",
//             Key: file.name, // Sử dụng tên của file làm key
//             ContentType: file.type
//           },
//           (err, url) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(url);
//             }
//           }
//         );
//       });

//       // Đóng gói dữ liệu tệp tin vào FormData
//       const formData = new FormData();
//       formData.append('file', file);

//       // Gửi yêu cầu PUT đến presigned URL với dữ liệu FormData
//       await fetch(presignedURL, {
//         method: 'PUT',
//         body: formData,
//       });
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//     }
//   };
// };

export const UpdateUserProfile = (user_id, formData) => {
  return async (dispatch, getState) => {
    try {
      console.log("FORM DATA", formData);
      console.log("USER ID", user_id);
      const response = await axios.post(
        "/user/update-profile",
        { _id: user_id, ...formData }, // Thêm user_id và dữ liệu từ form vào payload
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      
      dispatch(
        showSnackbar({ severity: "success", message: response.data.message })
      );
    } catch (error) {
      let errorMessage = "Unknown error occurred.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      dispatch(showSnackbar({ severity: "error", message: errorMessage }));
    }
  };
}; 





