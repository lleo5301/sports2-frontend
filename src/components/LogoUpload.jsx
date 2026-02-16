import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LogoUpload({ currentLogoUrl, onLogoChange, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Logo URL is served via nginx proxy at /uploads/
  // No need to prepend API URL since nginx proxies /uploads/ to backend
  const displayLogoUrl = previewUrl || currentLogoUrl || null;

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = useCallback((file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, SVG, or WebP image');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB');
      return false;
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post('/teams/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Logo uploaded successfully');
        if (onLogoChange) {
          onLogoChange(response.data.data.logo_url);
        }
        setPreviewUrl(null); // Clear preview, use actual URL
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to upload logo';
      toast.error(message);
      setPreviewUrl(null); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onLogoChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, [disabled, uploadFile]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleRemoveLogo = async () => {
    if (disabled) return;

    setIsUploading(true);
    try {
      const response = await api.delete('/teams/logo');
      if (response.data.success) {
        toast.success('Logo removed');
        setPreviewUrl(null);
        if (onLogoChange) {
          onLogoChange(null);
        }
      }
    } catch (error) {
      toast.error('Failed to remove logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className="label">
        <span className="label-text font-medium">Team Logo</span>
      </label>

      {/* Current/Preview Logo */}
      {displayLogoUrl && (
        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
          <img
            src={displayLogoUrl}
            alt="Team logo"
            className="w-24 h-24 object-contain rounded-lg bg-white"
          />
          <div className="flex-1">
            <p className="text-sm text-base-content/70">Current logo</p>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={isUploading}
                className="btn btn-error btn-sm mt-2"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-base-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm text-base-content/70">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
              {displayLogoUrl ? (
                <ImageIcon className="w-6 h-6 text-base-content/50" />
              ) : (
                <Upload className="w-6 h-6 text-base-content/50" />
              )}
            </div>
            <div>
              <p className="font-medium text-base-content">
                {displayLogoUrl ? 'Replace logo' : 'Upload logo'}
              </p>
              <p className="text-sm text-base-content/70">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-base-content/50 mt-1">
                PNG, JPG, SVG, or WebP (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
