import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from "./MsgType";

const Message = ({menu}) => {
    return (
        <Box p={3}>
            <Stack spacing={3}>
                {Chat_History.map((el) => {
                    // khởi tạo swt case và mảng đối tượng cần truyền
                    switch (el.type) {
                        case "divider":
                            //thời gian
                            return <TimeLine el={el} />
                        case "msg":
                            switch (el.subtype) {
                                case "img":
                                    // hình ảnh
                                     return <MediaMsg el={el} menu={menu} />
                                case "doc":
                                    // tài liệu
                                   return <DocMsg el={el} menu={menu} />
                
                                case "link":
                                    return <LinkMsg el={el} menu={menu}/>
                                case "reply":
                                    // tin nhắn trả lời
                                    return <ReplyMsg el = {el} menu={menu} />
                                default:
                                    return <TextMsg el={el} menu={menu} />


                            }
                            break;

                        default:
                            return <></>;

                    }
                })}

            </Stack>

        </Box>

    )
}
export default Message;