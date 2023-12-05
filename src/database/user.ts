import mongoose, { Schema } from 'mongoose';

interface User {
    username: string;
    email: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model<User>('user', userSchema);

const insertDefaultUsers = async (): Promise<void> => {
    try {
        const defaultUsers: User[] = [
            {
                username: 'admin',
                email: 'admin@example.com'
            },
            {
                username: 'john_doe',
                email: 'john.doe@example.com',
            },
            {
                username: 'ser_kh',
                email: 'ser.doe@example.com',
            },
        ];

        for (const user of defaultUsers) {
            const existingUser = await UserModel.findOne({ username: user.username });

            if (!existingUser) {
                const newUser = new UserModel(user);
                await newUser.save();
                console.log(`User "${user.username}" inserted.`);
            } else {
                console.log(`User "${user.username}" already exists.`);
            }
        }
    } catch (error) {
        console.error('Error inserting default users:', error);
        throw error;
    }
};


export { UserModel, insertDefaultUsers };
