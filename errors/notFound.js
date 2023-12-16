import { StatusCodes } from 'http-status-codes';
import CustomErrorAPI from './customErrorAPI.js';
class NotFoundError extends CustomErrorAPI {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
};
export default NotFoundError;