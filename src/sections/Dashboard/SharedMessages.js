import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSidebarType } from "../../redux/slices/app";
import { faker } from "@faker-js/faker";
import { DocMsg, LinkMsg, MediaMsg, TextMsg } from "./Conversation";
import ScrollbarCustom from "../../components/ScrollbarCustom";

const Media = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Shared</Typography>
          </Stack>
        </Box>

        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
          }}
          spacing={3}
          padding={value === 1 ? 1 : 3}
        >
          <ScrollbarCustom autoHeightMin={"100%"}>
            {current_messages.map((message, idx) => (
              <React.Fragment key={idx}>
                {(() => {
                  switch (value) {
                    case 0:
                      // Lọc ra các tin nhắn có type là 'text'
                      if (message.type === 'image') {
                        return <MediaMsg el={message} key={idx} />;
                      }
                      return null;
                    case 1:
                      if (message.text.includes('http') || message.text.includes('www')) {
                        return <TextMsg el={message} key={idx} />;
                      }
                       break;
                    case 2:
                      if (message.type === 'doc') {
                        return <DocMsg el={message} key={idx} />;
                      }
                      break;   
                    default:
                      return null;
                  }
                })()}
              </React.Fragment>
            ))}
          </ScrollbarCustom>

        </Stack>
      </Stack>
    </Box>
  );
};

export default Media;
