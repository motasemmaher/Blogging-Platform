'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParam?: string;
}

// Helper to generate the page URL
const getPageUrl = (page: number, searchParam?: string, baseUrl?: string) => {
  "use client";
  const url = new URL(`${window.location.origin}/${baseUrl}`);
  url.searchParams.set('page', page.toString());

  if (searchParam) {
    url.searchParams.set('search', searchParam);
  }

  return `${url.pathname}${url.search}`;
};

// Generate the array of page numbers to display
const getPageItems = (currentPage: number, totalPages: number, searchParam?: string, baseUrl?: string) => {
  const items = [];

  // Always show first page
  items.push(
    <PaginationItem key="page-1">
      <PaginationLink href={getPageUrl(1, searchParam, baseUrl)} isActive={currentPage === 1}>
        1
      </PaginationLink>
    </PaginationItem>
  );

  // Show ellipsis if not starting at page 2
  if (currentPage > 3) {
    items.push(
      <PaginationItem key="ellipsis-1">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  // Calculate range of page numbers to show
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  // Add page numbers in the middle
  for (let page = startPage; page <= endPage; page++) {
    if (page > 1 && page < totalPages) {
      items.push(
        <PaginationItem key={`page-${page}`}>
          <PaginationLink href={getPageUrl(page, searchParam, baseUrl)} isActive={currentPage === page}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }

  // Show ellipsis if not ending at the last page - 1
  if (currentPage < totalPages - 2) {
    items.push(
      <PaginationItem key="ellipsis-2">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  // Always show last page if there's more than one page
  if (totalPages > 1) {
    items.push(
      <PaginationItem key={`page-${totalPages}`}>
        <PaginationLink
          href={getPageUrl(totalPages, searchParam, baseUrl)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return items;
};


export function PostPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParam = '',
}: PostPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(currentPage - 1, searchParam, baseUrl)} />
          </PaginationItem>
        )}

        {getPageItems(currentPage, totalPages, searchParam, baseUrl)}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={getPageUrl(currentPage + 1, searchParam, baseUrl)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
} 