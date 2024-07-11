import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const BasicDatePicker = (name) => { 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={name} />
    </LocalizationProvider>
  );
}

export default BasicDatePicker;
