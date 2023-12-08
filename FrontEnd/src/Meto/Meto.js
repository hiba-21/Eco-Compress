import React, { useState, useEffect } from "react";
import axios from 'axios';
import TempIcon from "../icons/TempIcon";
import HumIcon from "../icons/HumIcon";

const Meto = () => {
    const url = "https://api.weatherapi.com/v1/current.json?key=c488b53ef6f84feabcb213112230712&q=sousse,tunisia&aqi=yes";
    const [data, setData] = useState([]);

    const fetchInfo = () => {
        return axios.get(url).then((res) => setData(res.data));
    };

    useEffect(() => {
        fetchInfo();
    }, []);
    console.log(data);
    if(data.length !== 0){
    return (
        <div className="flex justify-start items-center w-[60%]">
            <div className="relative w-full tracking-wider border-raduis flex flex-row align-center">
                <div className="text-[1.9rem] w-[50%]">
                    Today Weather
                </div>
                <div className="flex flex-row gap-3 relative w-full tracking-wider border-raduis justify-end w-[50%]">
                    <div className="flex flex-row items-end gap-2 justify-center">
                        <div className="text-[1.5rem]" >
                            <TempIcon />
                        </div>
                        <p className="text-[1rem]" >{data.current.temp_c}°</p>
                    </div>
                    <div className="flex flex-row items-end gap-1">
                        <div className="text-[1.9rem]" >
                            <HumIcon />
                        </div >
                        <p className="text-[1rem]" >{data.current.humidity}%</p></div>
                </div>
            </div>
        </div>
    );
    }
}

export default Meto;
