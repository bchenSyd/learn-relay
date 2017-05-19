import casual from 'casual';
import moment from 'moment';


casual.define('eventIdentifier', eventId => {
    const id = eventId || casual.integer(115300, 115399);
    return {
        id: 'event:' + id,
        origId: '' + id
    }
});
casual.define('raceIdentifier', () => {
    const id = casual.integer(115300, 115399);
    return {
        id: 'race:' + id,
        origId: '' + id
    }
});

casual.define('country', () => {
    return casual.random_element([{ code: 'au', name: 'Australia' },
    { code: 'nz', name: 'New Zeland' },
    { code: 'uk' }, { name: 'United Kindom' }]);

})

casual.define('eventStatus', () => casual.random_element(['open2', 'open5', 'open6', 'closed', 'finalised']));

casual.define('outcomeDateString', () => moment().add(casual.integer(0, 60 * 24 * 2), 'minutes').format())

export { casual } 