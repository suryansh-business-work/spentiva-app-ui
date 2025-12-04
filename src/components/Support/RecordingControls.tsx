import React, { useState, useRef } from 'react';
import { Button, Tooltip, Box, Paper, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface RecordingControlsProps {
  onAddAttachment: (file: File, type: 'image' | 'video' | 'screenshot', preview?: string) => void;
  counts: { images: number; screenshots: number; videos: number };
  maxPerType: number;
  onMinimize: () => void;
  onRecordingChange?: (isRecording: boolean) => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  onAddAttachment,
  counts,
  maxPerType,
  onMinimize,
  onRecordingChange,
}) => {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const canAddAttachment = (type: 'image' | 'video' | 'screenshot') => {
    const typeMap = { image: counts.images, video: counts.videos, screenshot: counts.screenshots };
    return typeMap[type] < maxPerType;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxPerType - counts.images;
    files.slice(0, remaining).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onAddAttachment(file, 'image', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const captureScreenshot = async () => {
    if (!canAddAttachment('screenshot')) return;
    onMinimize();
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
          onAddAttachment(file, 'screenshot', canvas.toDataURL());
        }
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const startRecording = async () => {
    if (!canAddAttachment('video')) return;
    onMinimize();
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

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
        onAddAttachment(file, 'video', URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecording(false);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      onRecordingChange?.(true);
    } catch (err) {
      console.error('Recording failed:', err);
      setRecording(false);
      onRecordingChange?.(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    onRecordingChange?.(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
              Images ({counts.images}/{maxPerType})
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
              Screenshot ({counts.screenshots}/{maxPerType})
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
                Record ({counts.videos}/{maxPerType})
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
            Stop
          </Button>
        )}
      </Box>

      {/* Floating Recording Badge */}
      {recording && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            p: 1.5,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'error.dark',
            color: 'white',
          }}
        >
          <FiberManualRecordIcon
            sx={{
              fontSize: 16,
              animation: 'blink 1s infinite',
              '@keyframes blink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.3 },
              },
            }}
          />
          <Typography variant="body2" fontWeight={600}>
            {formatTime(recordingTime)}
          </Typography>
          <Button onClick={stopRecording} size="small" variant="contained" color="inherit">
            Stop
          </Button>
        </Paper>
      )}
    </>
  );
};

export default RecordingControls;
