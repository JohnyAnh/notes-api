import { body, validationResult } from "express-validator";
import { Request,Response, NextFunction } from "express";

export const createNoteRules = [
    body('titel').isString().isLength({ min: 1, max: 120}),
    body('body').optional().isString(),
    body('tags').optional().isArray(),
];

export function validate(req: Request, res: Response, next: NextFunction) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }
    next();
}