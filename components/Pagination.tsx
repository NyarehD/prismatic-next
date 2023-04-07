import { useRouter } from 'next/router';
import LeftIcon from './icons/LeftIcon';
import RightIcon from './icons/RightIcon';

interface PaginationProps {
  pageCount: number
}
export default function Pagination({ pageCount }: PaginationProps) {
  const router = useRouter();
  const page = Number(router.query?.page);
  function changePagination(page: number) {
    if (page > 0 && page <= pageCount) {
      router.push(`${router.route}?page=${page}`)
    }
  }
  return (
    <div className="btn-group float-right">
      <button title='Previous Page' className={`btn ${page <= 1 ? 'btn-disabled' : 'btn-active'} `} type="button" onClick={() => changePagination(page - 1)}><LeftIcon /></button>
      <button title='Current Page' className="btn btn-active">{router.query.page || 1}</button>
      <button title='Next Page' className={`btn ${page >= pageCount ? 'btn-disabled' : 'btn-active'} `} type="button" onClick={() => changePagination(page + 1)}><RightIcon /></button>
    </div>
  )
}
