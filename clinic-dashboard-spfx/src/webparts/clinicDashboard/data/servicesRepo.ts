import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IService, ServiceIcon, ServiceStatus } from "./models";

interface IServiceListItem {
  Id: number;
  Title: string;
  Description: string;
  Icon: ServiceIcon;
  Status: ServiceStatus;
  Queue: number;
}

function toService(item: IServiceListItem): IService {
  return {
    id: item.Id,
    name: item.Title,
    description: item.Description,
    icon: item.Icon,
    status: item.Status,
    queue: item.Queue,
  };
}

export async function getAllServices(): Promise<IService[]> {
  const sp = getSP();
  const items: IServiceListItem[] = [];
  const query = sp.web.lists
    .getByTitle(LIST_NAMES.Services)
    .items.select("Id", "Title", "Description", "Icon", "Status", "Queue");
  for await (const page of query) {
    items.push(...(page as IServiceListItem[]));
  }
  return items.map(toService);
}

export async function addService(data: {
  name: string;
  description: string;
  icon: ServiceIcon;
}): Promise<IService> {
  const sp = getSP();
  const result = await sp.web.lists.getByTitle(LIST_NAMES.Services).items.add({
    Title: data.name,
    Description: data.description,
    Icon: data.icon,
    Status: "Open",
    Queue: 0,
  });
  return toService(result as IServiceListItem);
}

export function flipServiceStatus(current: ServiceStatus): ServiceStatus {
  return current === "Open" ? "Closed" : "Open";
}

export function decrementQueue(current: number): number {
  return Math.max(0, current - 1);
}

export async function toggleServiceStatus(id: number, current: ServiceStatus): Promise<void> {
  const sp = getSP();
  await sp.web.lists
    .getByTitle(LIST_NAMES.Services)
    .items.getById(id)
    .update({ Status: flipServiceStatus(current) });
}

export async function callNext(id: number, currentQueue: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists
    .getByTitle(LIST_NAMES.Services)
    .items.getById(id)
    .update({ Queue: decrementQueue(currentQueue) });
}
