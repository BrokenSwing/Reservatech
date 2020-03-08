import { Event } from '../models/event';
import {EventParticipation} from '../models/event-participation';

const NAME_FORMAT = /^[a-zA-Z\u00C0-\u017F\- ]{1,30}$/;
const DESCRIPTION_FORMAT = /^.{30,800}$/;

export const Errors = {
    NOT_FOUND: new Error('Event not found'),
    INTERNAL: new Error('Internal error'),
    INVALID_NAME: new Error(`Invalid name format, must follow rules : ${NAME_FORMAT}`),
    INVALID_DESCRIPTION: new Error(`Invalid description format, must follow rules : ${DESCRIPTION_FORMAT}`),
    INVALID_DATE_ORDER: new Error('Beginning date must be anterior to end date'),
    UNKNOWN_ORGANIZATION: new Error('Unknown organization'),
    INVALID_MAX_PARTICIPANTS: new Error('Invalid max participants: must be greater than 0'),
    FULL: new Error('The event is full. It can\' accept more participants'),
    UNKNOWN_USER: new Error('Unknown user'),
    ALREADY_PARTICIPANT: new Error('This user already participe to event'),
    NOT_PARTICIPATING: new Error('This user does not participate to event'),
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

/**
 * Creates an event from the given parameters.
 *
 * This function rejects with Errors.INVALID_DATE_ORDER if beginning date is later than end date.
 * This function rejects with Errors.UNKNOWN_ORGANIZATION if given organization id refers to no organization.
 * This function rejects with Errors.INVALID_MAX_PARTICIPANTS if max participants isn't greater than 0.
 * This function rejects with Errors.INTERNAL if a problem occurred querying data source.
 *
 * @param name the event name
 * @param desc the event description
 * @param beginAt the beginning date for the event
 * @param endAt the end date for the event
 * @param maxParticipants the maximum of user that can participate to the event
 * @param organization the id of the organization this event belongs to
 *
 * @return the newly created event, or an error if a problem occurred
 */
export async function createEvent(
  name: string, desc: string, beginAt: Date, endAt: Date, maxParticipants: number, organization: number): Promise<Event> {

  if (!NAME_FORMAT.test(name)) {
    return Promise.reject(Errors.INVALID_NAME);
  }

  try {
    const event = await Event.create({
      name,
      description: desc,
      beginning: beginAt,
      end: endAt,
      maxParticipants,
      organizationId: organization,
    });

    return Promise.resolve(event);
  } catch (e) {
    if (e === Event.DATES_ERROR) {
      return Promise.reject(Errors.INVALID_DATE_ORDER);
    }
    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      return Promise.reject(Errors.UNKNOWN_ORGANIZATION);
    }
    if (e.name && e.name === 'SequelizeValidationError') {
      return Promise.reject(Errors.INVALID_MAX_PARTICIPANTS);
    }
    console.log('Unable to create event');
    console.log(e);
    return Promise.reject(Errors.INTERNAL);
  }


}

/**
 * Updates the properties of the event with the given id.
 *
 * This function rejects with Errors.INVALID_NAME if given name doesn't match required format.
 * This function rejects with Errors.INVALID_DESCRIPTION if given description doesn't match required format.
 * This function rejects with Errors.NOT_FOUND if no event with the given id exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param id the id of the event to update properties for
 * @param values the new values to set for the properties of the event
 *
 * @return the updated event, or an event
 */
export async function updateEvent(id: number, values: { name?: string, description?: string}): Promise<Event> {

  if (values.name) {
    values.name = values.name.trim();
  }

  if (values.description) {
    values.description = values.description.trim();
  }

  if (values.name && !NAME_FORMAT.test(values.name)) {
    return Promise.reject(Errors.INVALID_NAME);
  }

  if (values.description && !DESCRIPTION_FORMAT.test(values.description)) {
    return Promise.reject(Errors.INVALID_DESCRIPTION);
  }

  try {
    const event = await Event.findByPk(id);

    if (event === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    await event.update({
      name: values.name,
      description: values.description,
    });

    return Promise.resolve(event);
  } catch (e) {
    console.error(`Unable to update event ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Deletes the event with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no event with the given id exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param id the id of the event to delete
 *
 * @return nothing or an error
 */
export async function deleteEvent(id: number) {

  try {
    const deletedCount = await Event.destroy({
      where: {
        id,
      }
    });

    if (deletedCount === 0) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    return Promise.resolve();
  } catch (e) {
    console.error(`Unable to remove event ${id}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Adds the user with the given id to the list of participants of the event with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if event with the given id exists.
 * This function rejects with Errors.UNKNOWN_USER if no user with the given id was found.
 * This function rejects with Errors.FULL if no more user can be added as participant to the event with the given id.
 * This function rejects with Errors.ALREADY_PARTICIPANT if the user already participate to event.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param eventId the id of the event to add the user to
 * @param userId the id of the user to add as a participant to the event
 *
 * @return the event and the number of participants to this event, or an error
 */
export async function addParticipant(eventId: number, userId: number): Promise<Event> {

  try {

    const event: Event = await Event.findByPk(eventId);

    if (event === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const participantsCount: number = await EventParticipation.count({
      where: {
        eventId: event.id,
      }
    });

    if (participantsCount + 1 > event.maxParticipants) {
      return Promise.reject(Errors.FULL);
    }

    await EventParticipation.create({
      eventId: event.id,
      userId,
    });

    return Promise.resolve(event);
  } catch (e) {

    if (e.name && e.name === 'SequelizeForeignKeyConstraintError') {
      return Promise.reject(Errors.UNKNOWN_USER);
    }

    if (e.name && e.name === 'SequelizeUniqueConstraintError') {
      return Promise.reject(Errors.ALREADY_PARTICIPANT);
    }

    console.error(`Unable to add participant ${userId} to event ${eventId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Finds all participants to the event with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no event with the given id exists.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param eventId the id of the event to retrieve participants to
 *
 * @return an array of user ids, all participating to event. Or an error.
 */
export async function findAllParticipants(eventId: number): Promise<number[]> {

  try {
    const event = await Event.findByPk(eventId);

    if (event === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const participants: EventParticipation[] = await EventParticipation.findAll({
      where: {
        eventId: event.id,
      }
    });

    return Promise.resolve(participants.map(p => p.userId));
  } catch (e) {
    console.error(`Unable to find participants for event ${eventId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }

}

/**
 * Removes the user with the given id from the participants of the event with the given id.
 *
 * This function rejects with Errors.NOT_FOUND if no event with the given id exists.
 * This function rejects with Errors.NOT_PARTICIPATING if the user does not participate to the event.
 * This function rejects with Errors.INTERNAL if an error occurred while querying data source.
 *
 * @param eventId the id of the event to remove the user from
 * @param userId the id of the user to remove from the event
 *
 * @return nothing or an error
 */
export async function removeParticipant(eventId: number, userId: number): Promise<void> {

  try {
    const event: Event = await Event.findByPk(eventId);

    if (event === null) {
      return Promise.reject(Errors.NOT_FOUND);
    }

    const destroyedCount: number = await EventParticipation.destroy({
      where: {
        eventId: event.id,
        userId,
      }
    });

    if (destroyedCount === 0) {
      return Promise.reject(Errors.NOT_PARTICIPATING);
    }

    return Promise.resolve();
  } catch (e) {
    console.error(`Unable to add participant ${userId} to event ${eventId}`);
    console.error(e);
    return Promise.reject(Errors.INTERNAL);
  }
}
