import logger from "../config/logger.js";

function errorMiddleware(error, request, reply){
    let statusCode=500;
    let message="Internal Server Error";
    if(error.code==="FST_ERR_VALIDATION"){
        statusCode=400;
        message="Validation Error";
logger.info(error); 
    }
    else {
        logger.error(error);
    }
const response={
    code:statusCode,
    message,
};
reply.code(statusCode).send(response);

}
export default errorMiddleware;
