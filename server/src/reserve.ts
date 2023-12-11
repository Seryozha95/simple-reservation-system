import ReservationModel, { ReservationInterface } from './database/reservation';
import moment from 'moment-timezone';
import { Request, Response } from 'express';
import { messages } from './utils/constants';
import mongoose, { ClientSession } from 'mongoose';
import findTimeSlots from './utils/findSlots';

const createAndSendReservation = async (userId: number, utcdateTime: Date, tableNumber: number, description: string, session: ClientSession, res: Response) => {
    try {
        const newReservation = new ReservationModel({ userId, dateTime: utcdateTime, tableNumber, description, endTime: moment(utcdateTime).add(3, 'hours').toDate() });
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

const sendResponse = (res: Response, status: number, message: ReservationInterface | ReservationInterface[] | string): void => {
    res.status(status).json(message);
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


// TODO add time period
const getReservedSlotsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const reservations: ReservationInterface[] = await ReservationModel.find({
            userId
        }).select('dateTime').select('endTime').select('description')

        sendResponse(res, 200, reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: messages.local.internalServerError });
    }
};

// Endpoint for getting reservations within a time range
const getReservedSlots = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startTime, endTime } = req.query;

        // Check if both start and end times are provided
        if (!startTime || !endTime) {
            // res.status(400).json({ message: 'Both startTime and endTime are required in the query parameters' });
            // return
        }

        const reservations: ReservationInterface[] = await ReservationModel.find({
            // dateTime: { $gte: new Date(+startTime), $lt: new Date(+endTime) },
        });

        res.status(200).json(findTimeSlots(reservations))
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const reserve = async (req: Request, res: Response): Promise<void> => {
    let session: ClientSession | null = null;
    try {
        const { userId, dateTime, tableNumber, description } = req.body;

        const utcdateTime = new Date(new Date(dateTime).setMinutes(0, 0, 0));

        session = await mongoose.startSession();
        await session.startTransaction();

        const [reservation, reservationPrevious] = await findReservations(utcdateTime, tableNumber, session);

        const existingReservations = [...reservation, ...reservationPrevious];

        if (!existingReservations.length) {
            const newReservation = await createAndSendReservation(userId, utcdateTime, tableNumber, description, session, res)
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
            const newReservation = await createAndSendReservation(userId, utcdateTime, tableNumber, description, session, res);
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
export {
    reserve,
    getReservedSlots,
    getReservedSlotsByUser
}