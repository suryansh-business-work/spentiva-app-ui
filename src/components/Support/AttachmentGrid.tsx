import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export interface Attachment {
  id: string;
  file: File;
  type: 'image' | 'video' | 'screenshot';
  preview?: string;
}

interface AttachmentGridProps {
  attachments: Attachment[];
  onPreview: (attachment: Attachment) => void;
  onDelete: (id: string) => void;
}

const AttachmentGrid: React.FC<AttachmentGridProps> = ({ attachments, onPreview, onDelete }) => {
  if (attachments.length === 0) return null;

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" mb={1} display="block">
        Attachments ({attachments.length}/15)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 1,
        }}
      >
        {attachments.map(att => (
          <Box
            key={att.id}
            onClick={() => onPreview(att)}
            sx={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: att.type === 'video' ? 'error.main' : 'divider',
              transition: 'all 0.2s',
              boxShadow: 2,
            }}
          >
            {att.type === 'video' ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%', bgcolor: 'black' }}>
                <video
                  src={att.preview}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <VideocamIcon
                  sx={{ position: 'absolute', top: 8, left: 8, color: 'error.main', fontSize: 24 }}
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={att.preview}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {att.type === 'screenshot' && (
                  <CameraAltIcon
                    sx={{ position: 'absolute', top: 8, left: 8, color: 'info.main', fontSize: 24 }}
                  />
                )}
              </Box>
            )}
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onDelete(att.id);
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AttachmentGrid;
