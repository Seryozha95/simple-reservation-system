import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { UserModel } from '../database/user';
import { messages } from './constants';
import TableModel from '../database/table';

const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const validateRequestBody = [
    body('userId').isNumeric(),
    body('tableNumber').isNumeric(),
    body('dateTime').custom((value) => {
        if (!isValidDate(value)) {
            throw new Error(messages.response.error.invalidDateFormat);
        }
        return true;
    }),
]

export default async (req: Request, res: Response, next: Function) => {
    await Promise.all(validateRequestBody.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, tableNumber } = req.body;

    const user = await UserModel.findOne({ userId });
    if (!user) {
        return res.status(404).json({ message: messages.response.error.userNotFound });
    }
    const table = await TableModel.findOne({ tableNumber })
    if (!table) {
        return res.status(404).json({ message: messages.response.error.tableNotFound });
    }
    next();
}