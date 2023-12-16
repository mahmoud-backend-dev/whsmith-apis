import { StatusCodes } from 'http-status-codes';
import CustomErrorAPI from './customErrorAPI.js';

class UnauthenticatedError extends CustomErrorAPI {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
};

export default UnauthenticatedError;