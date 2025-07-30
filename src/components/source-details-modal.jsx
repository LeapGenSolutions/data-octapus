import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Database, 
  Server, 
  Globe, 
  Calendar, 
  Clock, 
  Settings,
  FileText,
  Shield
} from "lucide-react";

export function SourceDetailsModal({ source, isOpen, onClose }) {
  if (!source) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: "bg-[#4CAF50] text-white" },
      maintenance: { className: "bg-[#FF9800] text-white" },
      inactive: { className: "bg-[#F44336] text-white" }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    
    return (
      <Badge className={config.className}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Active'}
      </Badge>
    );
  };

  const getSourceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'sql':
      case 'oracle':
      case 'postgresql':
      case 'mongodb':
      case 'datawarehouse':
        return <Database className="h-5 w-5" />;
      case 'files':
      case 'blob':
        return <FileText className="h-5 w-5" />;
      case 'rest':
        return <Globe className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  const getLocationIcon = (location) => {
    return location === 'cloud' ? <Globe className="h-4 w-4" /> : <Server className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getSourceTypeDisplayName = (type) => {
    const typeMap = {
      sql: 'SQL Database',
      oracle: 'Oracle Database',
      postgresql: 'PostgreSQL Database',
      mongodb: 'MongoDB',
      files: 'File System',
      blob: 'Blob Storage',
      rest: 'REST API',
      datawarehouse: 'Data Warehouse'
    };
    return typeMap[type?.toLowerCase()] || type || 'Unknown';
  };

  const getLocationDisplayName = (location) => {
    return location === 'cloud' ? 'Cloud' : 'On-Premises';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-gray-900">
            {getSourceTypeIcon(source.type)}
            {source.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Detailed configuration and status information for this data source
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Type</span>
                </div>
                <span className="text-sm text-gray-900">{getSourceTypeDisplayName(source.type)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getLocationIcon(source.location)}
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <span className="text-sm text-gray-900">{getLocationDisplayName(source.location)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Auth Type</span>
                </div>
                <span className="text-sm text-gray-900">
                  {source.configuration?.authType || source.configuration?.authMethod || 'N/A'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                {getStatusBadge(source.status)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Created</span>
                </div>
                <span className="text-sm text-gray-900">{formatDate(source.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Last Sync</span>
                </div>
                <span className="text-sm text-gray-900">{formatDate(source.lastSync)}</span>
              </div>
            </div>
          </div>

          {/* Additional Configuration */}
          {(source.customPrompt || source.dataSelectionMode || source.selectedTables) && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Configuration
              </h4>

              {source.customPrompt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Custom Prompt</label>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">{source.customPrompt}</p>
                  </div>
                </div>
              )}

              {source.dataSelectionMode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data Selection Mode</label>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700 capitalize">
                      {source.dataSelectionMode.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                </div>
              )}

              {source.selectedTables && source.selectedTables.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Selected Tables/Collections</label>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex flex-wrap gap-1">
                      {source.selectedTables.slice(0, 5).map((table, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                      {source.selectedTables.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{source.selectedTables.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Workspace Information */}
          {source.workspaceName && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Workspace</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{source.workspaceName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose} className="bg-[#2196F3] hover:bg-[#1976D2] text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 