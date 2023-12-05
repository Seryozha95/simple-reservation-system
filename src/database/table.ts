import mongoose, { Schema } from 'mongoose';
import { messages } from '../utils/constants';

interface Table {
    tableNumber: number

}

const TableSchema: Schema = new Schema({
    tableNumber: { type: Number, required: true }
});

const TableModel = mongoose.model<Table>('table', TableSchema);

const insertDefaultTables = async (): Promise<void> => {
    try {
        const defaulTables: Table[] = [
            {
                tableNumber: 1
            },
            {
                tableNumber: 2
            }
        ];

        for (const table of defaulTables) {
            const existingTable = await TableModel.findOne({ tableNumber: table.tableNumber });

            if (!existingTable) {
                const newUser = new TableModel(table);
                await newUser.save();
                console.log(messages.local.defaultTableInitiated,  table.tableNumber);
            } else {
                console.log(messages.local.defaultTableAlreadyExists,  table.tableNumber);
            }
        }
    } catch (error) {
        throw error;
    }
};

export default TableModel;
export { insertDefaultTables }