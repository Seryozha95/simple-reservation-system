import { ReservationInterface } from "../database/reservation";

// TODO optimize

export default (data: ReservationInterface[]) => {

    const result = [];

    // Extract unique dates from the data
    const uniqueDates = Array.from(new Set(data.map(record => new Date(record.dateTime).toISOString().split('T')[0])));

    for (const targetDate of uniqueDates) {
        const dateFilteredData: ReservationInterface[] = data.filter(record => {
            const recordDate = new Date(record.dateTime).toISOString().split('T')[0];
            return recordDate === targetDate;
        });

        if (dateFilteredData.length < 2) {
            // If there are fewer than two records for the given date, skip to the next date
            continue;
        }

        const sortedData = dateFilteredData.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return dateA.getTime() - dateB.getTime();
        });

        for (let i = 0; i < sortedData.length - 1; i++) {
            const intervalStart = new Date(sortedData[i].dateTime);
            const intervalEnd = new Date(sortedData[i].endTime);

            for (let j = i + 1; j < sortedData.length; j++) {
                const currentStart = new Date(sortedData[j].dateTime);
                const currentEnd = new Date(sortedData[j].endTime);

                // Check if the intervals overlap
                if (currentStart <= intervalEnd) {
                    // Found an interval with at least two records
                    result.push({ dateTime: intervalStart.toISOString(), endTime: currentEnd.toISOString() , description: 'Full Reserved'});
                }
            }
        }
    }

    return result;
}

