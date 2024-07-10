import { Box, Avatar, Paper, TextField, Typography } from "@mui/material";
import { getUserData } from "@/actions/userActions";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState();

  let { user, user_data, status, error, isAuth } = useSelector(
    (state) => state.user,
  );

  const get_user_information = async () => {
    let response = await dispatch(getUserData());
  };
  if (user_data == null) {
    get_user_information();
  }
  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
          firstNamelastName
        </Avatar>
        <Typography variant="h4"> {user_data?.user.username} </Typography>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1">about</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <TextField
          label="Username"
          value="userName"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          value="********"
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    </Paper>
  );
};

export default ProfilePage;
