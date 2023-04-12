/**
 * To get how many items should be skipped
 * @param page Insert context.query?.page
 * @returns current page
 */
export default function getPageSkip(page: number | string, take: number = 8): number {
  if (typeof page === "number") {
    return page ? (page - 1) * take : 0;
  } else {
    return page ? (Number(page) - 1) * take : 0;
  }
}