import { casual } from './utils';
import { MockList } from 'graphql-tools';
import { getEventId, getOutComeDateString } from './utils';
import competitorResolver from './competitor';
import moment from 'moment';


const raceResolver = () => {
    const raceIdentifier = casual.raceIdentifier;
    const country = casual.country;
    return {
        id: raceIdentifier.id,
        origId: raceIdentifier.origId,
        countryCode: country.code,
        countryName: country.name,
        meetingName: casual.word,
        name: casual.title,
        outcomeDateString: casual.outcomeDateString,
        type: 't',
        state: 'VIC',
        status: casual.eventStatus,
        distance: casual.integer(500, 2000) + 'm'
    }
};

export default raceResolver;