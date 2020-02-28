import { Sequelize } from 'sequelize-typescript';
import { User } from './user';
import { Organization } from './organization';
import { Event } from './event';
import { OrganizationMember } from './organization-member';
import { EventParticipation } from './event-participation';

async function init(): Promise<Sequelize> {

  const models = [User, Organization, Event, OrganizationMember, EventParticipation];

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    models,
  });

  try {
    await sequelize.authenticate();
  } catch (e) {
    console.error('Unable to connect to database');
    console.error(e);
    return Promise.reject();
  }

  try {
    await sequelize.sync();
  } catch (e) {
    console.log('Unable to sync database schema.');
    console.error(e);
    return Promise.reject();
  }

  return sequelize;
}

export default { init };
