import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Attachment } from './AttachmentGrid';

interface AttachmentPreviewProps {
  open: boolean;
  attachment: Attachment | null;
  onClose: () => void;
  onEdit?: (attachment: Attachment) => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  open,
  attachment,
  onClose,
  onEdit,
}) => {
  if (!attachment) return null;

  const canEdit = attachment.type !== 'video' && onEdit;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { boxShadow: 24 } }}
    >
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        <Typography variant="h6">
          {attachment.type === 'video' ? 'Video Preview' : 'Image Preview'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
          {attachment.type === 'video' ? (
            <video src={attachment.preview} controls style={{ width: '100%', borderRadius: 8 }} />
          ) : (
            <img
              src={attachment.preview}
              alt="Preview"
              style={{ width: '100%', borderRadius: 8 }}
            />
          )}
        </Box>
      </DialogContent>
      {canEdit && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              onEdit(attachment);
              onClose();
            }}
          >
            Edit & Annotate
          </Button>
        </DialogActions>
      )}
      {!canEdit && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AttachmentPreview;
