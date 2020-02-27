import { Organization } from '../models/organization';

export const Errors = {
  NOT_FOUND: new Error('Organization not found'),
  INTERNAL: new Error('Internal error'),
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
