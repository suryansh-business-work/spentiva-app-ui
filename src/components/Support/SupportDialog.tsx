import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Stack,
  Typography,
  Paper,
  Fade,
} from '@mui/material';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import AttachmentGrid, { Attachment } from './AttachmentGrid';
import RecordingControls from './RecordingControls';
import AttachmentPreview from './AttachmentPreview';
import ImageEditor from './ImageEditor';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  currentPlan: 'free' | 'pro' | 'businesspro';
}

const PaperComponent = (props: any) => {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds="parent"
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
};

const SupportDialog: React.FC<SupportDialogProps> = ({
  open,
  onClose,
  userName,
  userEmail,
  currentPlan,
}) => {
  const [supportType, setSupportType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [recording, setRecording] = useState(false);

  const supportTypes = {
    payment: 'Payment Related',
    bug: 'Bug In App',
    dataloss: 'Data Loss',
    other: 'Other',
  };

  const getCounts = useCallback(() => {
    return {
      images: attachments.filter(a => a.type === 'image').length,
      screenshots: attachments.filter(a => a.type === 'screenshot').length,
      videos: attachments.filter(a => a.type === 'video').length,
    };
  }, [attachments]);

  const handleAddAttachment = (file: File, type: Attachment['type'], preview?: string) => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36),
      file,
      type,
      preview,
    };
    setAttachments(prev => [...prev, newAttachment]);
    setMinimized(false); // Restore after capture
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleEditSave = (editedFile: File, preview: string) => {
    if (!editingAttachment) return;
    setAttachments(prev =>
      prev.map(att =>
        att.id === editingAttachment.id ? { ...att, file: editedFile, preview } : att
      )
    );
    setEditingAttachment(null);
    setPreviewAttachment({ ...editingAttachment, file: editedFile, preview });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', userName);
    formData.append('email', userEmail);
    formData.append('plan', currentPlan);
    formData.append('type', supportTypes[supportType as keyof typeof supportTypes]);
    formData.append('subject', subject);
    formData.append('message', message);
    attachments.forEach((att, idx) => {
      formData.append(`attachment_${idx}`, att.file);
    });
    console.log('Support ticket submitted with', attachments.length, 'attachments');
    // TODO: API call
    handleReset();
  };

  const handleReset = () => {
    setSubject('');
    setMessage('');
    setSupportType('');
    setAttachments([]);
    setMinimized(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open && !recording}
        onClose={() => {}}
        PaperComponent={PaperComponent}
        hideBackdrop
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            boxShadow: minimized ? 4 : 24,
            ...(minimized
              ? {
                  bottom: 16,
                  right: 16,
                  top: 'auto',
                  left: 'auto',
                  height: 56,
                  width: 320,
                  overflow: 'hidden',
                  m: 0,
                }
              : {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }),
          },
        }}
      >
        <DialogTitle
          style={{ cursor: 'move' }}
          id="draggable-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5,
            px: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Contact Support
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setMinimized(!minimized)}
              sx={{ color: 'inherit' }}
            >
              {minimized ? <MaximizeIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        {!minimized && (
          <Fade in={!minimized}>
            <Box>
              <DialogContent sx={{ pt: 2.5 }}>
                <Stack spacing={2.5}>
                  <TextField
                    select
                    label="Issue Type *"
                    value={supportType}
                    onChange={e => setSupportType(e.target.value)}
                    fullWidth
                    size="small"
                  >
                    {Object.entries(supportTypes).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Subject *"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="Brief description of the issue"
                  />

                  <TextField
                    label="Message *"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                    placeholder="Detailed explanation with steps to reproduce..."
                  />

                  <AttachmentGrid
                    attachments={attachments}
                    onPreview={setPreviewAttachment}
                    onDelete={handleDeleteAttachment}
                  />
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 2.5, pb: 2, gap: 1, flexWrap: 'wrap' }}>
                <RecordingControls
                  onAddAttachment={handleAddAttachment}
                  counts={getCounts()}
                  maxPerType={5}
                  onMinimize={() => setMinimized(true)}
                  onRecordingChange={setRecording}
                />
                <Box sx={{ flex: 1 }} />
                <Button onClick={handleReset} variant="outlined">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!supportType || !subject || !message}
                >
                  Submit Ticket
                </Button>
              </DialogActions>
            </Box>
          </Fade>
        )}
      </Dialog>

      <AttachmentPreview
        open={!!previewAttachment}
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        onEdit={setEditingAttachment}
      />

      <ImageEditor
        open={!!editingAttachment}
        attachment={editingAttachment}
        onSave={handleEditSave}
        onCancel={() => setEditingAttachment(null)}
      />
    </>
  );
};

export default SupportDialog;
