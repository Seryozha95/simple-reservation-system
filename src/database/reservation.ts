import mongoose, { Schema, Document } from 'mongoose';

interface ReservationInterface extends Document {
    dateTime: Date
    userIds: string;
    tableNumber: number
}

const reservationSchema: Schema = new Schema({
    dateTime: { type: Date, required: true},
    userIds: { type: String, required: true },
    tableNumber: {type: Number, required: true}
});

const ReservationModel = mongoose.model<ReservationInterface>('reservation', reservationSchema);

export default ReservationModel;
export { ReservationInterface }