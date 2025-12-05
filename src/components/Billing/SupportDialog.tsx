import React, { useState, useRef, useEffect } from 'react';
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
  LinearProgress,
  Paper,
  Tooltip,
  Fade,
} from '@mui/material';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface Attachment {
  id: string;
  file: File;
  type: 'image' | 'video' | 'screenshot';
  preview?: string;
}

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  currentPlan: 'free' | 'pro' | 'businesspro';
  onDrawerClose?: () => void;
}

const PaperComponent = (props: any) => (
  <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper {...props} />
  </Draggable>
);

const SupportDialog: React.FC<SupportDialogProps> = ({
  open,
  onClose,
  userName,
  userEmail,
  currentPlan,
  onDrawerClose,
}) => {
  const [supportType, setSupportType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportTypes = {
    payment: 'Payment Related',
    bug: 'Bug In App',
    dataloss: 'Data Loss',
    other: 'Other',
  };

  // Close drawer when dialog opens
  useEffect(() => {
    if (open && onDrawerClose) {
      onDrawerClose();
    }
  }, [open, onDrawerClose]);

  const getAttachmentCount = (type: 'image' | 'video' | 'screenshot') =>
    attachments.filter(a => a.type === type).length;

  const canAddAttachment = (type: 'image' | 'video' | 'screenshot') => getAttachmentCount(type) < 5;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - getAttachmentCount('image');
    files.slice(0, remaining).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const newAttachment: Attachment = {
            id: Math.random().toString(36),
            file,
            type: 'image',
            preview: reader.result as string,
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const captureScreenshot = async () => {
    if (!canAddAttachment('screenshot')) return;

    // Auto-minimize during screenshot
    setMinimized(true);

    // Small delay to let dialog minimize
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' } as any,
        preferCurrentTab: true,
      } as any);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
          const newAttachment: Attachment = {
            id: Math.random().toString(36),
            file,
            type: 'screenshot',
            preview: canvas.toDataURL(),
          };
          setAttachments(prev => [...prev, newAttachment]);
          // Restore after capture
          setMinimized(false);
        }
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
      setMinimized(false);
    }
  };

  const startRecording = async () => {
    if (!canAddAttachment('video')) return;

    // Auto-minimize during recording
    setMinimized(true);

    // Small delay to let dialog minimize
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' } as any,
        audio: true,
        preferCurrentTab: true,
      } as any);

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
        const newAttachment: Attachment = {
          id: Math.random().toString(36),
          file,
          type: 'video',
          preview: URL.createObjectURL(blob),
        };
        setAttachments(prev => [...prev, newAttachment]);
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        // Restore after recording
        setMinimized(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Recording failed:', err);
      setRecording(false);
      setMinimized(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
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
    console.log('Support request submitted with', attachments.length, 'attachments');

    // Clear form after submit
    setSubject('');
    setMessage('');
    setSupportType('');
    setAttachments([]);
    setMinimized(false);
    onClose();
  };

  const handleMinimizeToggle = () => {
    setMinimized(!minimized);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}} // Prevent accidental close
        PaperComponent={PaperComponent}
        hideBackdrop // NO OVERLAY!
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
            {recording ? '🔴 Recording...' : 'Contact Support'}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={handleMinimizeToggle} sx={{ color: 'inherit' }}>
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

                  {attachments.length > 0 && (
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
                            onClick={() => setPreviewAttachment(att)}
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
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: '100%',
                                  height: '100%',
                                  bgcolor: 'black',
                                }}
                              >
                                <video
                                  src={att.preview}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <VideocamIcon
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    color: 'error.main',
                                    fontSize: 24,
                                  }}
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
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      left: 8,
                                      color: 'info.main',
                                      fontSize: 24,
                                    }}
                                  />
                                )}
                              </Box>
                            )}
                            <IconButton
                              onClick={e => {
                                e.stopPropagation();
                                removeAttachment(att.id);
                              }}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                width: 24,
                                height: 24,
                              }}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {recording && <LinearProgress color="error" />}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 2.5, pb: 2, gap: 1, flexWrap: 'wrap' }}>
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />

                <Tooltip title="Upload images from your device (Max 5)" arrow>
                  <span>
                    <Button
                      startIcon={<AttachFileIcon />}
                      endIcon={<HelpOutlineIcon fontSize="small" />}
                      onClick={() => fileInputRef.current?.click()}
                      size="small"
                      disabled={!canAddAttachment('image')}
                    >
                      Images ({getAttachmentCount('image')}/5)
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title="Capture a screenshot - Dialog will minimize automatically" arrow>
                  <span>
                    <Button
                      startIcon={<CameraAltIcon />}
                      endIcon={<HelpOutlineIcon fontSize="small" />}
                      onClick={captureScreenshot}
                      size="small"
                      disabled={!canAddAttachment('screenshot')}
                      color="info"
                    >
                      Screenshot ({getAttachmentCount('screenshot')}/5)
                    </Button>
                  </span>
                </Tooltip>

                {!recording ? (
                  <Tooltip
                    title="Record your screen - Dialog will minimize. Click Stop when done (Max 5)"
                    arrow
                  >
                    <span>
                      <Button
                        startIcon={<VideocamIcon />}
                        endIcon={<HelpOutlineIcon fontSize="small" />}
                        onClick={startRecording}
                        size="small"
                        color="error"
                        disabled={!canAddAttachment('video')}
                      >
                        Record ({getAttachmentCount('video')}/5)
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    startIcon={<StopIcon />}
                    onClick={stopRecording}
                    size="small"
                    color="error"
                    variant="contained"
                  >
                    Stop Recording
                  </Button>
                )}

                <Box sx={{ flex: 1 }} />
                <Button onClick={onClose} variant="outlined">
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

      {/* Preview Dialog */}
      <Dialog
        open={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { boxShadow: 24 },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h6">
            {previewAttachment?.type === 'video' ? 'Video Preview' : 'Image Preview'}
          </Typography>
          <IconButton onClick={() => setPreviewAttachment(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewAttachment?.type === 'video' ? (
            <video
              src={previewAttachment.preview}
              controls
              style={{ width: '100%', borderRadius: 8 }}
            />
          ) : (
            <img
              src={previewAttachment?.preview}
              alt="Preview"
              style={{ width: '100%', borderRadius: 8 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportDialog;
