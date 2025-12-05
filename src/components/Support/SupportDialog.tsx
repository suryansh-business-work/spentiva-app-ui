import React, { useState } from 'react';
import { Paper, Fade, Box } from '@mui/material';
import Draggable from 'react-draggable';
import SupportDialogHeader from './SupportDialogHeader';
import SupportForm from './SupportForm';
import AttachmentPreview from './AttachmentPreview';
import { Attachment } from './AttachmentGrid';
import { useRecording } from './hooks/useRecording';

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
  const [minimized, setMinimized] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { recording, recordingTime, startRecording, stopRecording } = useRecording();

  const handleAddAttachment = (file: File, type: Attachment['type'], preview?: string) => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36),
      file,
      type,
      preview,
    };
    setAttachments(prev => [...prev, newAttachment]);
    setMinimized(false);
  };

  const handleStartRecording = async () => {
    await startRecording(() => setMinimized(true), handleAddAttachment);
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
          <SupportDialogHeader
            recording={recording}
            recordingTime={recordingTime}
            minimized={minimized}
            onMinimize={() => setMinimized(!minimized)}
            onStopRecording={stopRecording}
            onClose={onClose}
          />

          {!minimized && (
            <Fade in={!minimized}>
              <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                <SupportForm
                  userName={userName}
                  userEmail={userEmail}
                  currentPlan={currentPlan}
                  recording={recording}
                  onStartRecording={handleStartRecording}
                  onMinimize={() => setMinimized(true)}
                  onClose={onClose}
                  attachments={attachments}
                  onAddAttachment={handleAddAttachment}
                  onDeleteAttachment={id => setAttachments(prev => prev.filter(a => a.id !== id))}
                  onPreviewAttachment={setPreviewAttachment}
                />
              </Box>
            </Fade>
          )}
        </Paper>
      </Draggable>

      <AttachmentPreview
        open={!!previewAttachment}
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
};

export default SupportDialog;
