import React, { useState, useRef } from 'react';
import { Paper, Fade, Box } from '@mui/material';
import Draggable from 'react-draggable';
import SupportDialogHeader from './SupportDialogHeader';
import SupportForm from './SupportForm';
import AttachmentPreview from './AttachmentPreview';
import { Attachment } from './AttachmentGrid';
import { useRecording } from './hooks/useRecording';
import { useFileUpload } from './hooks/useFileUpload';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

const SupportDialog: React.FC<SupportDialogProps> = ({ open, onClose }) => {
  const [minimized, setMinimized] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const draggableRef = useRef<HTMLDivElement>(null);

  const { recording, recordingTime, startRecording, stopRecording } = useRecording();
  const { uploadFile } = useFileUpload();

  const handleAddAttachment = (file: File, type: Attachment['type'], preview?: string) => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36),
      file,
      type,
      preview,
      uploadStatus: 'pending',
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const handleUploadAttachment = async (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (!attachment) return;

    // Set uploading status
    setAttachments(prev =>
      prev.map(a => (a.id === id ? { ...a, uploadStatus: 'uploading' as const } : a))
    );

    try {
      const uploadedData = await uploadFile(attachment.file);

      if (uploadedData) {
        // Set uploaded status with complete data
        setAttachments(prev =>
          prev.map(a =>
            a.id === id
              ? { ...a, uploadStatus: 'uploaded' as const, uploadedData }
              : a
          )
        );
      } else {
        // Set error status
        setAttachments(prev =>
          prev.map(a =>
            a.id === id
              ? { ...a, uploadStatus: 'error' as const, uploadError: 'Upload failed' }
              : a
          )
        );
      }
    } catch (error) {
      // Set error status
      setAttachments(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, uploadStatus: 'error' as const, uploadError: 'Upload failed' }
            : a
        )
      );
    }
  };

  const handleStartRecording = async () => {
    await startRecording(() => setMinimized(true), handleAddAttachment);
  };

  if (!open) return null;

  return (
    <>
      <Draggable
        nodeRef={draggableRef}
        handle="#draggable-dialog-title"
        disabled={minimized}
        bounds="parent"
      >
        <Paper
          ref={draggableRef}
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

          <Fade in={!minimized}>
            <Box
              sx={{
                display: minimized ? 'none' : 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flex: 1
              }}
            >
              <SupportForm
                recording={recording}
                onStartRecording={handleStartRecording}
                onMinimize={() => setMinimized(true)}
                onClose={onClose}
                attachments={attachments}
                onAddAttachment={handleAddAttachment}
                onDeleteAttachment={id => setAttachments(prev => prev.filter(a => a.id !== id))}
                onPreviewAttachment={setPreviewAttachment}
                onUploadAttachment={handleUploadAttachment}
              />
            </Box>
          </Fade>
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
