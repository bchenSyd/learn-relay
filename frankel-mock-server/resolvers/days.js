import { casual } from './utils';
import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';
const daysResolver = () => {
    return [{
        name: 'Today',
        date: moment().startOf('day'),
    },
    {
        name: 'Tomorrow',
        date: moment().startOf('day').add(1, 'days')
    },
    {
        name: 'Futures',
        date: moment().startOf('day').add(8, 'days')
    }].map( val => ({
        id: 'day:' + val.date.format(dateFormat),
        dateString: val.date.format(dateFormat),
        displayName: val.name
    }));

};

export default daysResolver;