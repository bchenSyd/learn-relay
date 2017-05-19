import { casual } from './utils';
import { MockList } from 'graphql-tools';
import moment from 'moment';
const meetingResolver = () => {
    const id = casual.word + '_au_t_' + moment().add(casual.integer(0, 100), 'hours').format('DD_MM_YYYY');
    return {
        countryCode: casual.country.code,
        id: 'meeting:' + id,
        name: casual.word,
        origId: id,
        raceType: 't',
        races: ()=> new MockList([4,8])
    }
};

export default meetingResolver;