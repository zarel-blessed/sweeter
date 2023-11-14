import axios from "axios";

const fetcherClient = axios.create({
    baseURL: "http://localhost:4020/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default fetcherClient;
