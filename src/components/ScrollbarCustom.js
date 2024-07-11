import { Scrollbars } from 'react-custom-scrollbars';
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ScrollbarCustom = ({ autoHide = true, autoHideTimeout = 2000, autoHideDuration = 500, autoHeight = true, autoHeightMin = "100%", ...parameters }) => {
  const scrollbarsRef = useRef(null);
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    if (scrollbarsRef.current) {
      // Tự động cuộn xuống dưới cùng khi có nội dung mới
      scrollbarsRef.current.scrollToBottom();
    }
  }, [current_messages]); // Theo dõi sự thay đổi của nội dung

  return (
    <Scrollbars
      autoHide={autoHide}
      autoHideTimeout={autoHideTimeout}
      autoHideDuration={autoHideDuration}
      autoHeight={autoHeight}
      autoHeightMin={autoHeightMin}
      ref={scrollbarsRef}
      onUpdate={(values) => {
        // Thực hiện các hành động khi thanh cuộn được cập nhật
      }}
      {...parameters}
    />
  );
};

export default ScrollbarCustom;
