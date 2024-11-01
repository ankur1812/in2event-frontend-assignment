import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, pageSize, onPageChange, onSizeChange }) => {
  

  // Update page when a button is clicked
  const handlePageClick = (page:number) => {
    onPageChange(page); // Trigger the page change callback
  };

  // Handle page size change
  const handlePageSizeChange = (e:Event) => {
    const newSize = parseInt(e.target?.value);
    onSizeChange(newSize); // Trigger the page size change callback
  };

  // Calculate page numbers for display
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-between justify-between">
      <div className="flex space-x-2 mt-4">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded focus:outline-none focus:shadow-none hover:bg-blue-400 ${
              page === currentPage ? 'bg-blue-400 text-white' : ''
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="mt-2">
        <label className="mr-2">Page Size:</label>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded px-2 py-1 bg-inherit text-inherit"
        >
          <option className="bg-inherit text-inherit" value="5">5</option>
          <option className="bg-inherit text-inherit" value="10">10</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
