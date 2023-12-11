import { makeAutoObservable, runInAction } from 'mobx';
import { IEventInfo } from '../components/EventCalendar';

// TODO move to env
// TODO create come constants file
const API_BASE_URL = 'http://localhost:5000';

type ERROR = {
    message: string
}

class AppStore {
    myReservations: IEventInfo[] = [];
    alreadyReservedSlots: IEventInfo[] = [];
    userId: number = 1;
    isLoading: boolean = false;
    hasError: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUserId(userId: number) {
        runInAction(() => {
            this.userId = userId
            this.isLoading = true
        })
        this.initiate()

    }

    handleErrorClose = () => {
        runInAction(() => {
            this.hasError = null
        })
    }

    async reserve(start: Date, userId: number) {
        try {
            const postData = {
                dateTime: start,
                userId,
                tableNumber: 1
            };

            const response = await fetch(`${API_BASE_URL}/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();

            if (!result.ok) {
                throw new Error(result.message);
            }

            runInAction(() => {
                this.myReservations = [
                    {
                        _id: result._id,
                        start,
                        end: new Date(result.endTime),
                        description: 'descriptio'
                    },
                    ...this.myReservations
                ];
                this.isLoading = false;
            });
        } catch (error) {
            console.error('Error reserving slot:', error);
            this.hasError = (error as ERROR)?.message;
        }
    }

    async initiate() {
        try {
            // TODO remove hard coded strings
            const result = await this.fetchEventData(`/reservedSlots/${this.userId}`);
            const result1 = await this.fetchEventData('/fullReservedSlots');

            runInAction(() => {
                this.myReservations = result;
                this.alreadyReservedSlots = result1;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    private async fetchEventData(endpoint: string): Promise<IEventInfo[]> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const result = await response.json();

        return result.map((item: any) => ({
            _id: item._id,
            start: new Date(item.dateTime),
            end: new Date(item.endTime),
            description: item.description || 'asd'
        }));
    }
}

const store = new AppStore();
export default store;
