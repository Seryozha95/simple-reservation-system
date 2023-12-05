import mongoose, { Schema } from 'mongoose';

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
                console.log(`Table "${table.tableNumber}" inserted.`);
            } else {
                console.log(`Table "${table.tableNumber}" already exists.`);
            }
        }
    } catch (error) {
        console.error('Error inserting default tables:', error);
        throw error;
    }
};

export default TableModel;
export { insertDefaultTables }