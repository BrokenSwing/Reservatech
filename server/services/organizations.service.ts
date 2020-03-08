import { Organization } from '../models/organization';
import * as usersService from '../services/users.service';
import { OrganizationMember } from '../models/organization-member';
import { Event } from '../models/event';
import {User} from '../models/user';

const NAME_FORMAT = /^[a-zA-Z\u00C0-\u017F\- ]{1,30}$/;
const DESCRIPTION_FORMAT = /^.{20,300}$/;

export const Errors = {
  NOT_FOUND: new Error('Organization not found'),
  INTERNAL: new Error('Internal error'),
  INVALID_NAME_FORMAT: new Error(`Name must follow format : ${NAME_FORMAT}`),
  UNKNOWN_USER: new Error('No user with the given id exists'),
  DESCRIPTION_FORMAT: new Error(`Description must follow format ${DESCRIPTION_FORMAT}`),
  ALREADY_MEMBER: new Error('This user is already member of this organization'),
  NOT_A_MEMBER: new Error('This user is not a member of the organization'),
};

/**
 * Finds the organization with the given id.
 * This function rejects with Errors.NOT_FOUND if no organization with the given id was found.
 * This function rejects with Errors.INTERNAL if there's a problem while querying data source.
 *
 * @param id the organization id
 * @return the organization with the given id, or an error indicating which problem occurred
 */
export async function findById(id: number): Promise<Organization> {

  try {
    const organization = await Organization.findByPk(id);

    if (organization !== null) {
      return Promise.resolve(organization);
    }

    return Promise.reject(Errors.NOT_FOUND);

  } catch (e) {
    console.error(`Unable to fetch organization from id: ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Fetches all known organizations.
 * This function rejects with Errors.INTERNAl if an error occurred while querying data source.
 *
 * @return an array of organizations or an error
 */
export async function findAll(): Promise<Organization[]> {

  try {
    const organizations = await Organization.findAll();
    return Promise.resolve(organizations);
  } catch (e) {
    console.error('Unable to fetch all organizations.');
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Creates an new organization with the given name and the given description.
 * An organization must have at least 1 member, the user with the given owner id
 * becomes a member of this newly created organization.
 *
 * This function rejects with Errors.UNKNOWN_USER if no user with the given id exists.
 * This function rejects with Errors.INVALID_NAME_FORMAT if the given name has an invalid format.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 * This function rejects with Errors.DESCRIPTION_FORMAT if description has an invalid format.
 *
 * @param name the organization name
 * @param desc the organization description
 * @param owner the id of the user which creates the organization
 *
 * @return the newly created organization, or an error
 */
export async function createOrganization(name: string, desc: string, owner: number): Promise<Organization> {

  name = name.trim();
  desc = desc.trim();

  if (!NAME_FORMAT.test(name)) {
    return Promise.reject(Errors.INVALID_NAME_FORMAT);
  }

  if (!DESCRIPTION_FORMAT.test(desc)) {
    return Promise.reject(Errors.DESCRIPTION_FORMAT);
  }

  try {
    // This query could be avoided capturing ForeignKey error on OrganizationMember
    // creation and deleting previously created organization on error
    const user = await usersService.findById(owner);

    const organization = await Organization.create({
      name,
      description: desc,
    });

    await OrganizationMember.create({
      userId: user.id,
      organizationId: organization.id,
    });

    return Promise.resolve(organization);

  } catch (e) {
    if (e === usersService.Errors.NOT_FOUND) {
      return Promise.reject(Errors.UNKNOWN_USER);
    } else {
      return Promise.reject(Errors.INTERNAL);
    }
  }

}

/**
 * Deletes the organization with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param id the id of the organization to delete
 *
 * @return nothing if deletion succeeded, else return an error
 */
export async function deleteOrganization(id: number): Promise<void> {

  try {
    const deletedCount = await Organization.destroy({
      where: {
        id,
      }
    });

    if (deletedCount === 0) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    return Promise.resolve();
  } catch (e) {
    console.error(`Unable to delete organization with id: ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Finds all members for the organization with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param id the id of the organization to find members for
 *
 * @return an array of integers containing the ids of users being members of the organization with given id
 */
export async function findOrganizationMembers(id: number): Promise<number[]> {

  try {
    const members: OrganizationMember[] = await OrganizationMember.findAll({
      where: {
        organizationId: id,
      }
    });

    if (members.length === 0) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    return members.map((member) => member.userId);

  } catch (e) {
    console.error(`Unable to fetch members for organization with id: ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Finds all events belonging to the organization with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id exists.
 * This function rejects with Errors.INTERNAL if an occurred while querying data soure.
 *
 * @param id the id of the organization to fetch events for
 *
 * @return an array of events or an error
 */
export async function findOrganizationEvents(id: number): Promise<Event[]> {

  try {
    const organization = await Organization.findByPk(id);
    if (organization === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const events = await Event.findAll({
      where: {
        organizationId: organization.id,
      }
    });

    return Promise.resolve(events);
  } catch (e) {
    console.error(`Unable to retrieve events for organization with id ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Updates the organization with the given id replacing it's properties with the given ones.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id was found.
 * This function rejects with Errors.NAME_FORMAT if the given name doesn't match required format.
 * This function rejects with Errors.DESCRIPTION_FORMAT if the given description doesn't match required format.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * If a new value for a property isn't give, it won't update it and therefor won't be validated.
 *
 * @param id the id of the organization to update
 * @param newValues the new values for the organization properties
 *
 * @return the updated organization or an error
 */
export async function updateOrganization(id: number, newValues: { name?: string, description?: string}): Promise<Organization> {

  if (newValues.name && !NAME_FORMAT.test(newValues.name.trim())) {
    return Promise.reject(Errors.INVALID_NAME_FORMAT);
  }

  if (newValues.description && !DESCRIPTION_FORMAT.test(newValues.description.trim())) {
    return Promise.reject(Errors.DESCRIPTION_FORMAT);
  }

  try {
    const organization: Organization = await Organization.findByPk(id);

    if (organization === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    await organization.update({ ...newValues });

    return Promise.resolve(organization);

  } catch (e) {
    console.error(`Unable to update organization with id ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Add the user with the given id to the members of the organization with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id was found.
 * This function rejects with Errors.UNKNOWN_USER if no user with the given id exists.
 * This function rejects with Errors.ALREADY_MEMBER if the user with the given id already is a member of the organization wih the given id.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param organizationId the id of the organization to add the user to
 * @param userId the id of the user to add to the organization
 *
 * @return nothing or an error
 */
export async function addMember(organizationId: number, userId: number): Promise<void> {
  try {
    const organization = await Organization.findByPk(organizationId);

    if (organization === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    await OrganizationMember.create({
      organizationId,
      userId,
    });

    return Promise.resolve();
  } catch (e) {
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      return Promise.reject(Errors.UNKNOWN_USER);
    }

    if (e.name && e.name === 'SequelizeUniqueConstraintError') {
      return Promise.reject(Errors.ALREADY_MEMBER);
    }

    console.error(`Unable to add user ${userId} to organization ${organizationId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }
}

/**
 * Deletes the user with the given id from the members list of the organization with the given id.
 * If, once the user removed from members list, the organization contains no member, the organization is deleted.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id exists.
 * This function rejects with Errors.NOT_A_MEMBER if the no user with the given id was found in members list.
 * THis function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 *
 * @param organizationId the id of the organization to delete a member from
 * @param userId the id of the user which is member you want to delete from organization members list
 *
 * @return true if user is removed from members list and organization is deleted, false if user is removed from members list and
 * organization isn't deleted, an error if something gone wrong
 */
export async function deleteMember(organizationId: number, userId: number): Promise<boolean> {

  try {
    const organization: Organization = await Organization.findByPk(organizationId);

    if (organization === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const destroyedCount: number = await OrganizationMember.destroy({
      where: {
        organizationId: organization.id,
        userId,
      }
    });

    if (destroyedCount === 0) {
      return Promise.reject(Errors.NOT_A_MEMBER);
    }

    const membersCount: number = await OrganizationMember.count({
      where: {
        organizationId: organization.id,
      }
    });

    if (membersCount === 0) {
      await organization.destroy();
      return Promise.resolve(true);
    }

    return Promise.resolve(false);

  } catch (e) {
    console.error(`Unable to remove member ${userId} from organization ${organizationId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Finds the user with given id in members list of organization with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no organization with the given id exists.
 * This function rejects with Errors.NOT_A_MEMBER if no user with the given id exists in organization members list.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param organizationId the id of the organization to search member in
 * @param userId the id of the user to find in organization members list
 *
 * @return the member, or an error
 */
export async function findMember(organizationId: number, userId: number): Promise<User> {

  try {
    const organization: Organization = await Organization.findByPk(organizationId);

    if (organization === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const member: User = await OrganizationMember.findOne({
      where: {
        organizationId: organization.id,
        userId,
      },
      include: [User]
    });

    if (member === null) {
      return Promise.reject(Errors.NOT_A_MEMBER);
    }

    return Promise.resolve(member);
  } catch (e) {
    console.error(`Unable to retrieve member with id ${userId} for organization ${organizationId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}
