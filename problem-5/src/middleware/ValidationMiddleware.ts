import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware(type: any, skipMissingProperties = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToInstance(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(", ");
                    res.status(400).send(message);
                } else {
                    next();
                }
            });
    };
}
