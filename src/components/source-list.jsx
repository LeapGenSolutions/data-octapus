import React, { useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import {
  Search,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Database,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { SourceDetailsModal } from "./source-details-modal";

import { toast } from "./ui/toaster.jsx";

export default function SourceList({
  sources=[], onAddSource, onEditSource,
  onDeleteSource, selectedWorkspace, setSelectedWorkspace, onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("sourceName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSources, setSelectedSources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSourceForModal, setSelectedSourceForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedSourceForDelete, setSelectedSourceForDelete] = useState(null);
  const itemsPerPage = 10;

  // Filter sources based on search term
  const filteredSources = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sources.filter(
      (source) =>
        source.sourceName.toLowerCase().includes(term) ||
        source.type.toLowerCase().includes(term) ||
        source.status.toLowerCase().includes(term)
    );
  }, [sources, searchTerm]);

  // Sort sources
  const sortedSources = useMemo(() => {
    return [...filteredSources].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredSources, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedSources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSources = sortedSources.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSourceForModal(null);
  };

  const handleSelectSource = (sourceId, checked) => {
    if (checked) {
      setSelectedSources([...selectedSources, sourceId]);
    } else {
      setSelectedSources(selectedSources.filter(id => id !== sourceId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSources(paginatedSources.map(source => source.id));
    } else {
      setSelectedSources([]);
    }
  };

  const handleDelete = (source) => {
    setShowAlertDialog(true);
    setSelectedSourceForDelete(source);
  };

  const handleContinueDelete = (source) => {
    setShowAlertDialog(false);
    if (onDeleteSource) {
      onDeleteSource(source.id);
      // Optionally, you can add a toast here if you have a toast system
      toast({
        title: "Source Deleted",
        description: `${source?.configuration?.sourceName || "Unnamed"} has been removed from your data sources.`,
        variant: "destructive",
      });
    }
  };

  const handleView = (source) => {
    // Create a detailed view modal or navigate to details page
    setSelectedSourceForModal(source);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: "bg-[#4CAF50] text-white" },
      maintenance: { className: "bg-[#FF9800] text-white" },
      inactive: { className: "bg-[#F44336] text-white" }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <Badge className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Workspace dropdown state (Redux)
  const workspaces = useSelector((state) => state.workspaces.workspaces) || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
            <p className="text-sm text-gray-600">
              Manage your connected data sources and brewing configurations
            </p>
          </div>
          {/* Workspace Dropdown */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={selectedWorkspace?.id || ""}
              onChange={e => {
                const ws = workspaces.find(w => w.id === e.target.value);
                setSelectedWorkspace(ws || "");
              }}
              disabled={workspaces.length === 0}
            >
              {workspaces.length === 0 ? (
                <option value="" disabled>No workspaces found</option>
              ) : (
                workspaces.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.workspaceName || ws.name || ws.id}</option>
                ))
              )
              }
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            className="border-[#2196F3] text-[#2196F3] flex items-center gap-2 hover:bg-blue-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={onAddSource}
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white flex items-center gap-2 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Add Source
          </Button>
        </div>
      </div>

      {filteredSources.length > 0 ? (
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black text-white border-gray-600 placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-200">
                  <TableHead className="w-12 text-gray-700">
                    <Checkbox
                      checked={selectedSources.length === paginatedSources.length && paginatedSources.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-gray-700 font-medium"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-gray-700 font-medium"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">Location</TableHead>
                  <TableHead className="text-gray-700 font-medium">Auth Type</TableHead>
                  <TableHead
                    className="cursor-pointer text-gray-700 font-medium"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSources.map((source) => (
                  <TableRow key={source.id} className="bg-white hover:bg-gray-50 border-gray-200">
                    <TableCell>
                      <Checkbox
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={(checked) => handleSelectSource(source.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-[#2196F3]">{source?.configuration?.sourceName || "Unnamed"}</TableCell>
                    <TableCell className="text-gray-600">{source?.configuration?.sourceType || "N/A"}</TableCell>
                    <TableCell className="text-gray-600">{source.location || 'N/A'}</TableCell>
                    <TableCell className="text-gray-600">{source.configuration?.authType || source.configuration?.authMethod || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(source.status?.toLowerCase() || 'active')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-gray-200">
                          <DropdownMenuItem onClick={() => handleView(source)} className="text-gray-700 hover:bg-gray-100">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditSource(source)} className="text-gray-700 hover:bg-gray-100">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(source)}
                            className="text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedSources.length)} of {sortedSources.length} sources
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <Database className="h-8 w-8 text-[#2196F3]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first data source to begin analyzing data</p>
          <Button
            onClick={onAddSource}
            variant="outline"
            className="border-[#2196F3] text-[#2196F3] hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first source
          </Button>
        </div>
      )}
      <SourceDetailsModal
        source={selectedSourceForModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      {showAlertDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowAlertDialog(false)}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" aria-hidden="true" />
            </div>
            <div className="flex items-start">
              <div className="ml-4 mt-0 text-left">
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  Are you absolutely sure?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 text-center">
                    This action cannot be undone. This will permanently delete the source <span className="font-semibold">"{selectedSourceForDelete?.configuration?.sourceName || "Unnamed"}"</span>.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-4 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAlertDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleContinueDelete(selectedSourceForDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}