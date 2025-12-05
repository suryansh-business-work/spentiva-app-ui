import React from 'react';
import { Formik, Form } from 'formik';
import { Button, TextField, MenuItem, Box, Stack } from '@mui/material';
import { supportFormSchema, initialFormValues, SupportFormValues } from './validationSchema';
import AttachmentGrid, { Attachment } from './AttachmentGrid';
import RecordingControls from './RecordingControls';

interface SupportFormProps {
  userName: string;
  userEmail: string;
  currentPlan: 'free' | 'pro' | 'businesspro';
  recording: boolean;
  onStartRecording: () => void;
  onMinimize: () => void;
  onClose: () => void;
  attachments: Attachment[];
  onAddAttachment: (file: File, type: Attachment['type'], preview?: string) => void;
  onDeleteAttachment: (id: string) => void;
  onPreviewAttachment: (attachment: Attachment) => void;
}

const supportTypes = {
  payment: 'Payment Related',
  bug: 'Bug In App',
  dataloss: 'Data Loss',
  other: 'Other',
};

const SupportForm: React.FC<SupportFormProps> = ({
  userName,
  userEmail,
  currentPlan,
  recording,
  onStartRecording,
  onMinimize,
  onClose,
  attachments,
  onAddAttachment,
  onDeleteAttachment,
  onPreviewAttachment,
}) => {
  const getCounts = () => ({
    images: attachments.filter(a => a.type === 'image').length,
    screenshots: attachments.filter(a => a.type === 'screenshot').length,
    videos: attachments.filter(a => a.type === 'video').length,
  });

  const handleSubmit = (values: SupportFormValues, { resetForm }: any) => {
    const formData = new FormData();
    formData.append('name', userName);
    formData.append('email', userEmail);
    formData.append('plan', currentPlan);
    formData.append('type', supportTypes[values.supportType as keyof typeof supportTypes]);
    formData.append('subject', values.subject);
    formData.append('message', values.message);

    attachments.forEach((att, idx) => {
      formData.append(`attachment_${idx}`, att.file);
    });

    console.log('Support ticket submitted:', values);
    console.log('Attachments:', attachments.length);
    // TODO: API call here

    // Reset form and attachments
    resetForm();
    onClose();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={supportFormSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
        <Form style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <Box sx={{ pt: 2.5, px: 2.5, pb: 2.5, overflowY: 'auto', flex: 1 }}>
            <Stack spacing={2.5}>
              <TextField
                select
                name="supportType"
                label="Issue Type *"
                value={values.supportType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.supportType && Boolean(errors.supportType)}
                helperText={touched.supportType && errors.supportType}
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
                name="subject"
                label="Subject *"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
                fullWidth
                size="small"
                placeholder="Brief description of the issue"
              />

              <TextField
                name="message"
                label="Message *"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                multiline
                rows={4}
                fullWidth
                size="small"
                placeholder="Detailed explanation with steps to reproduce..."
              />

              <AttachmentGrid
                attachments={attachments}
                onPreview={onPreviewAttachment}
                onDelete={onDeleteAttachment}
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
              onAddAttachment={onAddAttachment}
              counts={getCounts()}
              maxPerType={5}
              onMinimize={onMinimize}
              onStartRecording={onStartRecording}
              recording={recording}
              recordingTime={0}
            />
            <Box sx={{ flex: 1 }} />
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={!isValid || !dirty}>
              Submit Ticket
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SupportForm;
