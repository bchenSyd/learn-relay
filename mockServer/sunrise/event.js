import casual from 'casual';
import { MockList } from 'graphql-tools';


const getEvent = id => ({
    id: `event:${id}`,
    origId: '' + id,
    type: 't',
    silkUrl: 'https://dqp0psmzdy9om.cloudfront.net/77783_8_SPRITE_32x32.png',
    state: 'VIC',
    staus: casual.random_element['open2', 'open5', 'open6', 'closed'],
    noOfPlacings: casual.integer(1, 3),
    competitors: ()=> new MockList([5,10])
});

export default getEvent;