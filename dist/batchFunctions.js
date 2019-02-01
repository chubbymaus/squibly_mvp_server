"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dummy = exports.channelBatcher = void 0;

const channelBatcher = async (ids, models, user) => {
  // ids = [1, 2, 3, 4]
  // return = [team1: channels, teamChannels, ...]
  const results = await models.sequelize.query(`
      select distinct on (id) *
      from channels as c 
      left outer join pcmembers as pc 
      on c.id = pc.channel_id
      where c.team_id in (:teamIds) and (c.public = true or pc.user_id = :userId);`, {
    replacements: {
      teamIds: ids,
      userId: user.id
    },
    model: models.Channel,
    raw: true
  });
  const data = {}; // group by team

  results.forEach(r => {
    if (data[r.team_id]) {
      data[r.team_id].push(r);
    } else {
      data[r.team_id] = [r];
    }
  }); // [[{name: 'general'}], [], []]

  return ids.map(id => data[id]);
};

exports.channelBatcher = channelBatcher;
const dummy = 5;
exports.dummy = dummy;