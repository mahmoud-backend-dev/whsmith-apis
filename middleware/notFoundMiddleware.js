import { StatusCodes } from 'http-status-codes';
const notFound = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route does not exist')
};

export default notFound;