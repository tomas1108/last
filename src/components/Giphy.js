import React from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@mui/material";


const GiphySearchbox = ({ onSelect }) => {
  const giphyFetch = new GiphyFetch("J7znAmQCzLckerSb8J6ycmlQ1M6lqGwc"); // Thay YOUR_GIPHY_API_KEY bằng API key của bạn

  return (
    <Grid
      width={200}
      columns={3}
      fetchGifs={() => giphyFetch.trending({ offset: 0, limit: 10 })}
      onGifClick={(gif, e) => {
        onSelect(gif); // Gửi gif đã chọn đến hàm onSelect
      }}
    />
  );
};

export default GiphySearchbox;
