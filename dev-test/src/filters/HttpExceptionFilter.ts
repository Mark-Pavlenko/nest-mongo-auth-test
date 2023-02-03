
import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message;
        if (typeof exceptionResponse === 'string' || exceptionResponse instanceof String) {
            message = { message: exceptionResponse };
        } else {
            message = exceptionResponse;
        }

        response
            .status(status)
            .json({
                requestObject: request.body,
                ...message,
            });
    }
}