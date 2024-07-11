import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user: null,
  user_id: null,
  user_email: null,
  user_avatar: null,
  user_name : null,
  user_birthDate: null,
  user_gender: null,
  error: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
      state.user_email = action.payload.user_email;
      state.user_avatar = action.payload.user_avatar;
      state.user_name = action.payload.user_name;
      state.user_birthDate = action.payload.user_birthDate;
      state.user_gender = action.payload.user_gender
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
      state.user_email = null;
      state.user_avatar = null;
      state.user_name = null;
      state.user_birthDate = null;
      state.user_gender = null;
      
     
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
    
    updateUserProfileSuccess(state, action) {
      const {  user_name , user_birthDate, user_gender} = action.payload;
      state.user_name = user_name;
      state.user_birthDate = user_birthDate;
      state.user_gender = user_gender;
    },
    updateUserAvatarSuccess(state, action) {
      state.user_avatar = action.payload.user_avatar;
    },
  },
});

// Reducer
export default slice.reducer;

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/reset-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
            slice.actions.logIn({
              isLoggedIn: true,
              token: response.data.token,
            })
          );
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/forgot-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
       
      } )
      
      .catch(function (error) {
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function ChangePassowrd(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/change-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          slice.actions.signOut({
           
          })
        );
        
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
       
      } )
      
      .catch(function (error) {
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function createGroup (formValues) {
  return async (dispatch, getState) => {
    await axios
    .post(
      "user/create-group",
      {
        ...formValues,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    // Make API call here

    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/login",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
            user_id: response.data.user_id,
            user_email: response.data.user_email,
            user_avatar : response.data.user_avatar,
            user_name : response.data.user_name,
            user_birthDate : response.data.user_birthDate,
            user_gender: response.data.user_gender,

          })
        );
        window.localStorage.setItem("user_id", response.data.user_id);
        window.localStorage.setItem("user_email", response.data.user_email);
        window.localStorage.setItem("user_name", response.data.user_name);
        window.localStorage.setItem("user_avatar", response.data.user_avatar);
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    window.localStorage.removeItem("user_email");
    window.localStorage.removeItem("user_name");
    window.localStorage.removeItem("user_avatar");
    dispatch(slice.actions.signOut());
   
  };
}
// hàm register truyền vào tham số formvalues 

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/register",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          slice.actions.updateRegisterEmail({ email: formValues.email })
        );

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
        }
      });
  };
}


export function VerifyEmail(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/verify",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(slice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", response.data.user_id);
    /*     dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        ); */


        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        let errorMessage = "Unknown error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        dispatch(showSnackbar({ severity: "error", message: errorMessage }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });

      if (!getState().auth.error) {
        window.location.href = "/auth/login";
      }
  };
}



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
      )
      .then(function (response) {
      console.log("data user", response.data.data.user);
      dispatch(slice.actions.updateUserProfileSuccess({
        user_name: response.data.data.user.name,
        user_birthDate: response.data.data.user.dateOfBirth,
        user_gender: response.data.data.user.sex
      

      }));
      dispatch(
        showSnackbar({ severity: "success", message: response.data.message })
      );
    })
    } catch (error) {
      let errorMessage = "Unknown error occurred.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      dispatch(showSnackbar({ severity: "error", message: errorMessage }));
    }
  };
}; 
export const UpdateUserAvatar = (user_id, formData) => {
  return async (dispatch, getState) => {
    try {
      console.log("FORM DATA", formData);
      console.log("USER ID", user_id);
      const response = await axios.post(
        "/user/update-avatar",
        { _id: user_id, ...formData }, // Thêm user_id và dữ liệu từ form vào payload
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then(function (response) {
      console.log("data user", response.data.data.user);
      dispatch(slice.actions.updateUserAvatarSuccess({
        user_avatar:response.data.data.user.avatar,
      }));
      dispatch(
        showSnackbar({ severity: "success", message: response.data.message })
      );
    })
    } catch (error) {
      let errorMessage = "Unknown error occurred.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      dispatch(showSnackbar({ severity: "error", message: errorMessage }));
    }
  };
}; 