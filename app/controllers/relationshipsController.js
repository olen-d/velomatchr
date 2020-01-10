const { Relationship } = require("../models");

exports.update_relationships = (req, res) => {
  const relationships = [];
  const { matches, userId } = req.body;
  console.log(matches);
  const scores = new Map(matches);

  scores.forEach((value, key) => {
    relationships.push({ pair: `${userId}${key}`, requesterId: userId, addresseeId: key, matchScore: value, status: 0, actionUserId: userId });
    relationships.push({ pair: `${key}${userId}`, requesterId: key, addresseeId: userId, matchScore: value, status: 0, actionUserId: userId });
  });
  Relationship.bulkCreate(
    relationships,
    {
    updateOnDuplicate: ["matchScore", "actionUserId", "updatedAt"]
    }
  ).then(() => {
    return Relationship.findAll();
  }).then (newRelationships => {
    res.json(newRelationships);
  })
  .catch(err => {
    res.status(500).send(err);
  });
};
