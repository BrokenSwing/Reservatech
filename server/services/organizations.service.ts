import { Organization } from '../models/organization';
import * as usersService from '../services/users.service';
import { OrganizationMember } from '../models/organization-member';

const NAME_FORMAT = /^[a-zA-Z\u00C0-\u017F\- ]{1,30}/;

export const Errors = {
  NOT_FOUND: new Error('Organization not found'),
  INTERNAL: new Error('Internal error'),
  INVALID_NAME_FORMAT: new Error(`Name must follow format : ${NAME_FORMAT}`),
  UNKNOWN_USER: new Error('No user with the given id exists'),
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
 *
 * @param name the organization name
 * @param desc the organization description
 * @param owner the id of the user which creates the organization
 *
 * @return the newly created organization, or an error
 */
export async function createOrganization(name: string, desc: string, owner: number): Promise<Organization> {

  if (!NAME_FORMAT.test(name)) {
    return Promise.reject(Errors.INVALID_NAME_FORMAT);
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
