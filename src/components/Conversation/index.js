import React from "react";
import { Box, Stack } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";


const Conversation = () => {
    return (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
            {/* tao layout chat header */}
            <Header />
            {/* tao layout tin nhắn */}
            <Box width={"100%"} sx={{ flexGrow: 1, height:"100%"}}>
                <Message menu={true} />

            </Box>
            {/* tao layout chat footer */}
            <Footer />

        </Stack>
    );
};
export default Conversation