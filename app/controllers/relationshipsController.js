const Sequelize = require("sequelize");
// const fn = sequelize.fn;
const Op = Sequelize.Op;

const { v4: uuidv4 } = require("uuid");

const { Relationship, User } = require("../models");

exports.create_email_proxy = (req, res) => {
  const { body: { requesterId, addresseeId }, } = req;

  const requesterProxy = uuidv4();
  const addresseeProxy = uuidv4();

  const requesterUpdate = Relationship.update({ emailProxy: requesterProxy },
    {
      where: {
        requesterId,
        addresseeId,
        emailProxy: null
      }
    });

  const addresseeUpdate = Relationship.update({ emailProxy: addresseeProxy },
    {
      where: {
        requesterId: addresseeId,
        addresseeId: requesterId,
        emailProxy: null
      }
    });

  Promise.all([requesterUpdate, addresseeUpdate])
  .then(values => {
    if( values[0][0] === 1 && values[1][0] === 1) {
      res.status(200).send({ status: 200, message: "ok", data: [{ requesterProxy, addresseeProxy }] });
    } else {
      res.status(500).send({ status: 500, message: "Internal Server Error", error: "Anonymized email not created. " });
    }
  })
  .catch(error => {
    res.status(500).send({ status: 500, message: "Internal Server Error", error });
  })
};

exports.update_user_relationships = (req, res) => {
  const { authorized } = req;

  if (authorized) {
    const relationships = [];
    const { body: { matches, userId }, } = req;
  
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
      return Relationship.findAll({ where: { requesterId: userId }});
    }).then (newRelationships => {
      res.json(newRelationships);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  } else {
    res.sendStatus(403)
  }
};
// TODO: Add authorization
exports.read_email_address_by_proxy = (req, res) => {
  const { params: { proxy: emailProxy }, } = req;

  Relationship.findAll({
    where: {
      emailProxy,
      status: 2
    },
    attributes: [],
    include: [{
      model: User,
      as: "requester",
      attributes: ["email"]
    }]
  })
  .then(data => {
    if (data.length === 0) {
      res.status(404).send({ status: 404, message: "Not Found", error: "The email proxy supplied was invalid or does not exist." });
    } else {
      res.status(200).json({ status: 200, message: "ok", data });
    }
  })
  .catch(error => {
    res.status(500).send({ status: 500, message: "Internal Server Error", error });
  });
};

// TODO: Add authorization
exports.read_email_proxy_by_id = (req, res) => {
  const { params: { requesterid: requesterId, addresseeid: addresseeId }, } = req;

  Relationship.findAll({
    where: {
      requesterId,
      addresseeId
    },
    attributes: ["emailProxy"]
  })
  .then(data => {
    if (data.length === 0 ) {
      res.json({
        status: 404,
        message: "Not Found",
        error: "An email proxy for this sender and addressee was not found. "
      });
    } else {
      res.json({
        status: 200,
        message: "ok",
        data
      });
    }
  })
  .catch(error => {
    res.status(500).send({ status: 500, message: "Internal Server Error", error });
  })
};

exports.read_user_relationships_by_id = (req, res) => {
  const { authorized } = req;

  if (authorized) {
    const { params: { userid }, } = req;

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
  } else {
    res.sendStatus(403)
  }
};

exports.read_user_matched_count_by_id = (req, res) => {
  const { authorized } = req;

  if(authorized) {
    const { params: { userid }, } = req;

    Relationship.findAll({
      attributes: [[Relationship.sequelize.fn("COUNT", Relationship.sequelize.col("status")), "totalMatches"]],
      where: {
        requesterId: userid,
        status: 2
      }
    })
    .then(data => {
      res.json({ data })
    })
    .catch(err => {
      res.send(err)
    });
  } else {
    res.sendStatus(403)
  }
};

exports.update_user_relationship_status = (req, res) => {
  const { authorized } = req;

  if (authorized) {
    const { body: { requesterId, addresseeId, status, actionUserId }, } = req;

    Relationship.update(
      { status, actionUserId },
      { returning: true, where: {[Op.or]: [{[Op.and]: [{requesterId}, {addresseeId}]}, {[Op.and]: [{addresseeId: requesterId}, {requesterId: addresseeId}]}]}}
    )
    .then(data => {
      const [ , rows ] = data;

      if (rows !== 2 ) {  // Two and only two rows should be updated (the requester and the addressee)
        res.status(500).json({ status: 500, message: "Internal server error. Something went wrong and the relationship was not updated." });
      } else {
        res.status(200).json({ status: 200, message: "ok", data });
      }
    })
    .catch(error => {
      res.status(500).json({ status: 500, message: `Internal server error. Relationship not updated. Guru Meditation: ${error}` });
    })
  } else {
    res.sendStatus(403)
  }
};

// Delete
exports.delete_user_relationships = (req, res) => {
  const { authorized } = req;

  if (authorized) {
    const { params: { userid }, } = req;

    Relationship.destroy({
      where: { 
        [Op.and]: [
          { status: { [Op.lt]: 2 } },
          {
            [Op.or]: [
              { requesterId: userid },
              { addresseeId: userid },
            ]
          }
        ]
      }
    })
    .then(response => {
      if (response < 1) {
        // TODO: It's totally possible no relationsips were deleted
        res.json({ data: "No relationships were deleted." });
      } else {
        res.json({ data: "The previous realationships were successfully deleted." });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } else {
    res.sendStatus(403)
  }
};
