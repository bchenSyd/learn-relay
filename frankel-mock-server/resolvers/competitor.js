import casual from 'casual';

const competitorResolver = eventId => ({
    id: 9000000 + casual.integer(0, 9999),
    name: casual.word,
    eventId,
    eliminated: false, 
    jockey: casual.full_name,
    trainer: casual.full_name,
    weight: casual.integer(80,100)+'kg',
    lastSixRuns:'1,2,3,4,5,6'
});

export default competitorResolver;