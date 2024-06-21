import { useState } from "react";
import { EllipsisHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

const SubscriberListPagination = ({ data, itemsPerPage }) => {
    const navigate = useNavigate();

    const navigateToPage = (id) => {
        navigate(`/memberDetails/${id}`)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const renderPagination = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {

            if ((currentPage == 1 && i < 4) || [currentPage - 1, currentPage, currentPage + 1].includes(i) || i > totalPages - 3) {
                pages.push(
                    <button key={i} dataVal={i} onClick={() => paginate(i)} className={`${i == currentPage ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-900'} mx-2 px-3 py-1 rounded-lg` }>
                        {i}
                    </button>
                );
            }
        }
        if (pages[2]?.props?.dataVal + 1 !== pages[3]?.props?.dataVal && pages.length === 6) {
            console.log(pages.length);
            pages = [
                ...pages.slice(0, 3),
                <EllipsisHorizontalIcon className='w-5 h-5 inline text-indigo-900' />,
                ...pages.slice(3),
            ]
        }
        pages = [
            <button className="bg-indigo-600 p-1 text-white hover:bg-indigo-700 disabled:bg-gray-400 rounded-lg" disabled={currentPage === 1} onClick={() => setCurrentPage(val => val - 1)} > <ChevronLeftIcon className='w-6 h-6 inline cursor-pointer' /></button>,
            ...pages,
            <button className="bg-indigo-600 p-1 text-white hover:bg-indigo-700 disabled:bg-gray-400 rounded-lg" disabled={currentPage === totalPages} onClick={() => setCurrentPage(val => val + 1)} > <ChevronRightIcon className='w-6 h-6 inline cursor-pointer' /></button>
        ]
        return pages;
    };

    const renderData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return data.slice(startIndex, endIndex).map((subscriber) => (
            <tr key={subscriber.id}>
                <td className="whitespace-nowrap text-left px-12 py-4">
                    <div className="text-sm text-gray-900">{subscriber.email}</div>
                </td>
            </tr>
        ))
    };

    return (<>
        {renderData()}
        <tr>
            <td colSpan={3} className="py-5 select-none" >
                {renderPagination()}
            </td>
        </tr>
    </>
    );
};

export default SubscriberListPagination;