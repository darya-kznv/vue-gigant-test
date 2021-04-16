import dayjs from 'dayjs';

export const formatter = {
    getDate24Time: (date) => {
        return dayjs(date).format('YYYY-MM-DD HH:mm');
    },
}
