import ReservationModel, { ReservationInterface } from './database/reservation';
import moment from 'moment-timezone';
import { Request, Response } from 'express';
import { messages } from './utils/constants';
import mongoose, { ClientSession } from 'mongoose';

const createAndSendReservation = async (userId: number, utcdateTime: Date, tableNumber: number, session: ClientSession, res: Response) => {
    try {
        const newReservation = new ReservationModel({ userId, dateTime: utcdateTime, tableNumber });
        await newReservation.save({ session });
        await session.commitTransaction();
        session.endSession();
        sendResponse(res, 200, newReservation);
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        sendResponse(res, 500, messages.local.internalServerError);
    }
};

const sendResponse = (res: Response, status: number, message: ReservationInterface | string): void => {
    res.status(status).json({ message });
};

const findReservations = async (
    utcdateTime: Date, tableNumber: number, session: ClientSession): Promise<[ReservationInterface[], ReservationInterface[]]> => {
    const reservations = await Promise.all([
        ReservationModel.find({
            dateTime: { $gte: utcdateTime, $lt: moment(utcdateTime).add(3, 'hours').toDate() },
            tableNumber,
        }).session(session).exec(),
        ReservationModel.find({
            dateTime: { $gte: moment(utcdateTime).add(-2, 'hours').toDate(), $lt: utcdateTime },
            tableNumber,
        }).session(session).exec(),
    ]);

    return reservations;
};

export default async (req: Request, res: Response): Promise<void> => {
    let session: ClientSession | null = null;
    try {
        const { userId, dateTime, tableNumber } = req.body;

        const utcdateTime = new Date(new Date(dateTime).setMinutes(0, 0, 0));

        session = await mongoose.startSession();
        await session.startTransaction();

        const [reservation, reservationPrevious] = await findReservations(utcdateTime, tableNumber, session);

        const existingReservations = [...reservation, ...reservationPrevious];

        if (!existingReservations.length) {
            const newReservation = await createAndSendReservation(userId, utcdateTime, tableNumber, session, res)
            res.json(newReservation);
            return;
        }
        const alreadyReservedByUser = existingReservations.some(reserv => reserv.userId === userId);

        if (alreadyReservedByUser) {
            res.status(400).json({ message: messages.response.error.userAlreadyHasReservation });
            return;
        } else if (reservation.length > 1 || reservationPrevious.length > 1) {
            res.status(400).json({ message: messages.response.error.tableAlreadyReserved });
            return;
        }
        else {
            const newReservation = await createAndSendReservation(userId, utcdateTime, tableNumber, session, res);
            res.json(newReservation);
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.local.internalServerError });
    } finally {
        session?.endSession();
    }
};
