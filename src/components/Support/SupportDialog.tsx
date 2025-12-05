import React, { useState, useCallback } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Stack,
  Typography,
  Paper,
  Fade,
  Tooltip,
} from '@mui/material';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Lottie from 'lottie-react';
import AttachmentGrid, { Attachment } from './AttachmentGrid';
import RecordingControls from './RecordingControls';
import AttachmentPreview from './AttachmentPreview';
import ImageEditor from './ImageEditor';
import recordingAnimation from '../../../public/animations/recording.json';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  currentPlan: 'free' | 'pro' | 'businesspro';
}

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
  const [recordingTime, setRecordingTime] = useState(0);

  // Recording management refs
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<number | null>(null);

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
    setRecording(false);
    setRecordingTime(0);
    onClose();
  };

  const startRecording = async () => {
    const counts = getCounts();
    if (counts.videos >= 5) return;

    setMinimized(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' } as any,
        audio: true,
        preferCurrentTab: true,
      } as any);

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
        handleAddAttachment(file, 'video', URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecording(false);
        setRecordingTime(0);
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

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  return (
    <>
      <Draggable handle="#draggable-dialog-title" disabled={minimized} bounds="parent">
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            zIndex: 1300,
            boxShadow: minimized
              ? '0px 4px 12px rgba(0, 0, 0, 0.15)'
              : '0px 24px 48px rgba(0, 0, 0, 0.2)',
            ...(minimized
              ? {
                  bottom: 16,
                  right: 16,
                  width: recording ? 400 : 320,
                  height: 56,
                  overflow: 'hidden',
                }
              : {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: 900,
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                }),
          }}
        >
          {/* Title Bar */}
          <Box
            id={minimized ? undefined : 'draggable-dialog-title'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              bgcolor: recording ? '#000' : 'primary.main',
              color: 'primary.contrastText',
              cursor: minimized ? 'default' : 'move',
            }}
          >
            {recording ? (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lottie
                    animationData={recordingAnimation}
                    loop={true}
                    style={{ width: 32, height: 32 }}
                  />
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  Recording... {formatRecordingTime(recordingTime)}
                </Typography>
              </Stack>
            ) : minimized ? (
              <Typography variant="subtitle2" fontWeight={600}>
                Support Dialog
              </Typography>
            ) : (
              <Typography variant="subtitle1" fontWeight={700}>
                Contact Support
              </Typography>
            )}
            <Stack direction="row" spacing={0.5}>
              {recording ? (
                <>
                  <Tooltip title={minimized ? 'Expand dialog' : 'Minimize dialog'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => setMinimized(!minimized)}
                      sx={{ color: 'inherit' }}
                    >
                      {minimized ? (
                        <MaximizeIcon fontSize="small" />
                      ) : (
                        <MinimizeIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Stop recording" arrow>
                    <IconButton
                      size="small"
                      onClick={handleStopRecording}
                      sx={{
                        color: 'inherit',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <StopCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title={minimized ? 'Expand dialog' : 'Minimize dialog'} arrow>
                  <IconButton
                    size="small"
                    onClick={() => setMinimized(!minimized)}
                    sx={{ color: 'inherit' }}
                  >
                    {minimized ? (
                      <MaximizeIcon fontSize="small" />
                    ) : (
                      <MinimizeIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close" arrow>
                <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Dialog Content */}
          {!minimized && (
            <Fade in={!minimized}>
              <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                <Box sx={{ pt: 2.5, px: 2.5, pb: 2.5, overflowY: 'auto', flex: 1 }}>
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
                </Box>

                <Box
                  sx={{
                    px: 2.5,
                    pb: 2,
                    pt: 1.5,
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <RecordingControls
                    onAddAttachment={handleAddAttachment}
                    counts={getCounts()}
                    maxPerType={5}
                    onMinimize={() => setMinimized(true)}
                    onStartRecording={startRecording}
                    recording={recording}
                    recordingTime={0}
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
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>
      </Draggable>

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
