import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BrushIcon from '@mui/icons-material/Brush';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CropIcon from '@mui/icons-material/Crop';
import UndoIcon from '@mui/icons-material/Undo';
import { Attachment } from './AttachmentGrid';

interface ImageEditorProps {
  open: boolean;
  attachment: Attachment | null;
  onSave: (editedFile: File, preview: string) => void;
  onCancel: () => void;
}

type Tool = 'pen' | 'arrow' | 'text' | 'crop';

const ImageEditor: React.FC<ImageEditorProps> = ({ open, attachment, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#FF0000');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (open && attachment?.preview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        saveHistory();
      };
      img.src = attachment.preview;
    }
  }, [open, attachment]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory(prev => [...prev.slice(-9), imageData]);
      }
    }
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const lastState = newHistory[newHistory.length - 1];
      const canvas = canvasRef.current;
      if (canvas && lastState) {
        const ctx = canvas.getContext('2d');
        ctx?.putImageData(lastState, 0, 0);
        setHistory(newHistory);
      }
    }
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    if (width < 10 || height < 10) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, width, height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(imageData, 0, 0);

    setIsCropping(false);
    saveHistory();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setStartPos({ x, y });

    if (tool === 'crop') {
      setIsCropping(true);
      setCropStart({ x, y });
      setCropEnd({ x, y });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'pen') {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'crop') {
      setCropEnd({ x, y });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'crop' && isCropping) {
      setCropEnd({ x, y });
      setIsDrawing(false);
      return;
    }

    if (tool === 'arrow') {
      drawArrow(ctx, startPos.x, startPos.y, x, y);
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = `${lineWidth * 8}px Arial`;
        ctx.fillStyle = color;
        ctx.fillText(text, startPos.x, startPos.y);
      }
    }

    setIsDrawing(false);
    saveHistory();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const headlen = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 6),
      y2 - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 6),
      y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(x2, y2);
    ctx.fill();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !attachment) return;

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], attachment.file.name, { type: 'image/png' });
        const preview = canvas.toDataURL();
        onSave(file, preview);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { boxShadow: 24 } }}
    >
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        <Typography variant="h6">Edit Image</Typography>
        <IconButton onClick={onCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          bgcolor: 'background.default',
          flexWrap: 'wrap',
        }}
      >
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={(_, val) => val && setTool(val)}
          size="small"
        >
          <ToggleButton value="crop">
            <CropIcon />
          </ToggleButton>
          <ToggleButton value="pen">
            <BrushIcon />
          </ToggleButton>
          <ToggleButton value="arrow">
            <ArrowForwardIcon />
          </ToggleButton>
          <ToggleButton value="text">
            <TextFieldsIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {tool !== 'crop' && (
          <>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ height: 32 }}
            />
            <Box sx={{ width: 150 }}>
              <Typography variant="caption">Size: {lineWidth}</Typography>
              <Slider
                value={lineWidth}
                onChange={(_, val) => setLineWidth(val as number)}
                min={1}
                max={10}
                size="small"
              />
            </Box>
          </>
        )}

        <Button
          startIcon={<UndoIcon />}
          onClick={undo}
          disabled={history.length <= 1}
          size="small"
          variant="outlined"
        >
          Undo
        </Button>

        {isCropping && (
          <Button onClick={applyCrop} size="small" variant="contained" color="primary">
            Apply Crop
          </Button>
        )}
      </Box>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'auto',
            maxHeight: '60vh',
            bgcolor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              display: 'block',
              maxWidth: '100%',
              cursor: tool === 'crop' ? 'crosshair' : tool === 'pen' ? 'crosshair' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          {isCropping && (
            <Box
              sx={{
                position: 'absolute',
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.min(cropStart.y, cropEnd.y),
                width: Math.abs(cropEnd.x - cropStart.x),
                height: Math.abs(cropEnd.y - cropStart.y),
                border: '2px dashed #2196f3',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageEditor;
