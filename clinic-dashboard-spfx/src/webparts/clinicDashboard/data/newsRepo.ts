import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { INewsItem, NewsCategory } from "./models";

interface INewsListItem {
  Id: number;
  Title: string;
  Category: NewsCategory;
  Excerpt: string;
  Body: string;
  Created: string;
  Author: { Title: string } | null;
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toNewsItem(item: INewsListItem): INewsItem {
  return {
    id: item.Id,
    title: item.Title,
    category: item.Category,
    excerpt: item.Excerpt,
    body: item.Body,
    createdDate: item.Created,
    author: item.Author?.Title ?? "Unknown",
  };
}

export async function getAllNews(): Promise<INewsItem[]> {
  const sp = getSP();
  const items: INewsListItem[] = [];
  const query = sp.web.lists
    .getByTitle(LIST_NAMES.News)
    .items.select("Id", "Title", "Category", "Excerpt", "Body", "Created", "Author/Title")
    .expand("Author")
    .orderBy("Created", false);
  for await (const page of query) {
    items.push(...(page as INewsListItem[]));
  }
  return items.map(toNewsItem);
}

export async function addNews(data: {
  title: string;
  category: NewsCategory;
  excerpt: string;
  body: string;
}): Promise<INewsItem> {
  const sp = getSP();
  const result = await sp.web.lists.getByTitle(LIST_NAMES.News).items.add({
    Title: data.title,
    Category: data.category,
    Excerpt: data.excerpt,
    Body: data.body,
  });
  return toNewsItem(result as INewsListItem);
}

export async function removeNews(id: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.News).items.getById(id).delete();
}
