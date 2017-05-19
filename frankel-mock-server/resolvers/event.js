import { casual } from './utils';
import { MockList } from 'graphql-tools';
import { getEventId, getOutComeDateString } from './utils';
import competitorResolver from './competitor';

const eventResolver = eventId => {
    const eventIdentifier = casual.eventIdentifier(eventId);
    return {
        id: eventIdentifier.id,
        origId: eventIdentifier.origId,
        type: 't',
        silkUrl: 'https://dqp0psmzdy9om.cloudfront.net/77783_8_SPRITE_32x32.png',
        state: 'VIC',
        status: casual.eventStatus,
        noOfPlacings: casual.integer(1, 3),
        competitors: () => new MockList([5, 10], (parent, args, context) => {
            const { origId } = parent;
            return competitorResolver(parseInt(origId));
        }),
        dsitance: casual.integer(500, 2000) + 'm',
        outcomeDateString: casual.outcomeDateString,
    }
};

export default eventResolver;