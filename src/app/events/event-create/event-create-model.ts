export class EventCreateModel {

  constructor(
    public name: string,
    public description: string,
    public maxParticipants: number,
    public beginning: string,
    public end: string,
    public organizationId: number
  ) {}

}
