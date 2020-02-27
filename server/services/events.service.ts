import { Event } from '../models/event';

export const Errors = {
    NOT_FOUND: new Error('Event not found'),
    INTERNAL: new Error('Internal error'),
};

/**
 * Finds the event with the given id.
 * This function rejects with Errors.NOT_FOUND if no event with the given id was found.
 * This function rejects with Errors.INTERNAL if there's a problem while querying data source.
 *
 * @param id the organization id
 * @return the event with the given id, or an error indicating which problem occurred
 */
export async function findById(id: number): Promise<Event> {

  try {
    const event = await Event.findByPk(id);

    if (event !== null) {
      return Promise.resolve(event);
    }

    return Promise.reject(Errors.NOT_FOUND);

  } catch (e) {
    console.error(`Unable to fetch event from id: ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Fetches all known events.
 * This function rejects with Errors.INTERNAL if an occurred while querying data source.
 *
 * @return an array of events or error
 */
export async function findAll(): Promise<Event[]> {

  try {
    const events = await Event.findAll();
    return Promise.resolve(events);
  } catch (e) {
    console.error(`Unable to fetch all events.`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}
