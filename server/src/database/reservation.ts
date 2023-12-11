import mongoose, { Schema, Document } from 'mongoose';

interface ReservationInterface extends Document {
    dateTime: Date
    userId: number;
    tableNumber: number,
    endTime: Date,
    description: String
}

const reservationSchema: Schema = new Schema({
    dateTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    userId: { type: Number, required: true },
    tableNumber: {type: Number, required: true},
    description: {type: String, required: true}
});

const ReservationModel = mongoose.model<ReservationInterface>('reservation', reservationSchema);

export default ReservationModel;
export { ReservationInterface }