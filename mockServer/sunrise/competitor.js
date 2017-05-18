import casual from 'casual';

const getCompetitor = eventId => ({
    id: 9000000 + casual.integer(0, 9999),
    name: casual.word,
    eventId,
    eliminated: false
});

export default getCompetitor;