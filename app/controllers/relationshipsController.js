const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { Relationship, User } = require("../models");

exports.update_user_relationships = (req, res) => {
  const relationships = [];
  const { matches, userId } = req.body;

  const scores = new Map(matches);

  scores.forEach((value, key) => {
    relationships.push({ requesterId: userId, addresseeId: key, matchScore: value, status: 0, actionUserId: userId });
    relationships.push({ requesterId: key, addresseeId: userId, matchScore: value, status: 0, actionUserId: userId });
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

exports.read_user_relationships = (req, res) => {
  const userid = req.params.userid;

  Relationship.findAll({
    where: {
      requesterId: userid,
      status: {[Op.not]: 3 }
    },
    include: [{ 
      model: User, 
      as: "addressee",
      attributes: { exclude: ["password"]}
    }],
    order: [
      ["matchScore", "ASC"],
      ["updatedAt", "DESC"]
    ]
  })
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.send(err);
  });
};

exports.update_user_relationship_status = (req, res) => {
  console.log(req.body);
  const { requesterId, addresseeId, status, actionUserId } = req.body;

  Relationship.update(
    { status, actionUserId },
    { returning: true, where: {[Op.or]: [{[Op.and]: [{requesterId}, {addresseeId}]}, {[Op.and]: [{addresseeId: requesterId}, {requesterId: addresseeId}]}]}}
  )
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    console.log("relationshipsController.js - ERROR:\n", err);
  })
};
