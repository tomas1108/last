import React , {useState} from "react";
import { CircularProgress } from "@mui/material/CircularProgress";

const [loading , setLoading] = useState(true);
const CircularProgress = () => { 

    return (

        <>
        {

        loading ? <CircularProgress/> : <h1> Hello</h1>
        }
        
        </>
    );
};
export default CircularProgress;