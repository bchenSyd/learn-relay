import casual from 'casual';
import { MockList } from 'graphql-tools';
import competitorResolver from './competitor';

const eventResolver = eventId => {
    const id = eventId || casual.integer(115300, 115399);
    return {
        id: `event:${id}`,
        origId: '' + id,
        type: 't',
        silkUrl: 'https://dqp0psmzdy9om.cloudfront.net/77783_8_SPRITE_32x32.png',
        state: 'VIC',
        staus: casual.random_element['open2', 'open5', 'open6', 'closed'],
        noOfPlacings: casual.integer(1, 3),
        competitors: () => new MockList([5, 10], (parent, args, context) => {
            const { origId } = parent;
            return competitorResolver(parseInt(origId));
        })
    }
};

export default eventResolver;