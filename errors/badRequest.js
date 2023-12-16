import { StatusCodes } from 'http-status-codes';
import CustomErrorAPI from './customErrorAPI.js';
class BadRequest extends CustomErrorAPI {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
};

export default BadRequest;