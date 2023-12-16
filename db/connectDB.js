import { set, connect } from 'mongoose';
set('strictQuery', false);
const connectDB =  (uri) => {
    return connect(uri);
}

export default connectDB;