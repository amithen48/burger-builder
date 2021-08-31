import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://bureger-builder-af232.firebaseio.com/' 
});

export default instance;