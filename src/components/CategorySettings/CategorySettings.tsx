import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { endpoints } from '../../config/api';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../utils/http';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  trackerId: string;
  name: string;
  subcategories: SubCategory[];
}

interface CategorySettingsProps {
  trackerId: string;
}

interface CategorySettingsProps {
  trackerId: string;
}

const CategorySettings: React.FC<CategorySettingsProps> = ({ trackerId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'category' | 'subcategory'>('category');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    loadCategories();
  }, [trackerId]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.categories.categories(trackerId));
      const data = response.data?.categories || response.data?.data || [];
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setSnackbar({ open: true, message: 'Failed to load categories', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setDialogType('category');
    setDialogMode('add');
    setCategoryName('');
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setDialogType('category');
    setDialogMode('edit');
    setCategoryName(category.name);
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${category.name}" and all its subcategories?`
      )
    ) {
      try {
        await deleteRequest(endpoints.categories.category(trackerId, category.id));
        setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        setSnackbar({ open: true, message: 'Failed to delete category', severity: 'error' });
      }
    }
  };

  const handleAddSubcategory = (category: Category) => {
    setDialogType('subcategory');
    setDialogMode('add');
    setSubcategoryName('');
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setOpenDialog(true);
  };

  const handleEditSubcategory = (category: Category, subcategory: SubCategory) => {
    setDialogType('subcategory');
    setDialogMode('edit');
    setSubcategoryName(subcategory.name);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setOpenDialog(true);
  };

  const handleDeleteSubcategory = async (category: Category, subcategory: SubCategory) => {
    if (window.confirm(`Are you sure you want to delete "${subcategory.name}"?`)) {
      try {
        const updatedSubcategories = category.subcategories.filter(
          sub => sub.id !== subcategory.id
        );
        await putRequest(endpoints.categories.category(trackerId, category.id), {
          name: category.name,
          subcategories: updatedSubcategories,
        });
        setSnackbar({
          open: true,
          message: 'Subcategory deleted successfully',
          severity: 'success',
        });
        loadCategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        setSnackbar({ open: true, message: 'Failed to delete subcategory', severity: 'error' });
      }
    }
  };

  const handleSaveDialog = async () => {
    if (dialogType === 'category') {
      if (!categoryName.trim()) {
        setSnackbar({ open: true, message: 'Category name is required', severity: 'error' });
        return;
      }

      try {
        if (dialogMode === 'add') {
          await postRequest(endpoints.categories.categories(trackerId), {
            name: categoryName,
            subcategories: [],
          });
          setSnackbar({ open: true, message: 'Category added successfully', severity: 'success' });
        } else if (selectedCategory) {
          await putRequest(endpoints.categories.category(trackerId, selectedCategory.id), {
            name: categoryName,
            subcategories: selectedCategory.subcategories,
          });
          setSnackbar({
            open: true,
            message: 'Category updated successfully',
            severity: 'success',
          });
        }
        loadCategories();
      } catch (error) {
        console.error('Error saving category:', error);
        setSnackbar({ open: true, message: 'Failed to save category', severity: 'error' });
      }
    } else {
      if (!subcategoryName.trim()) {
        setSnackbar({ open: true, message: 'Subcategory name is required', severity: 'error' });
        return;
      }

      if (!selectedCategory) return;

      try {
        if (dialogMode === 'add') {
          const newSubcategory: SubCategory = {
            id: `${Date.now()}`,
            name: subcategoryName,
          };
          const updatedSubcategories = [...selectedCategory.subcategories, newSubcategory];
          await putRequest(endpoints.categories.category(trackerId, selectedCategory.id), {
            name: selectedCategory.name,
            subcategories: updatedSubcategories,
          });
          setSnackbar({
            open: true,
            message: 'Subcategory added successfully',
            severity: 'success',
          });
        } else if (selectedSubcategory) {
          const updatedSubcategories = selectedCategory.subcategories.map(sub =>
            sub.id === selectedSubcategory.id ? { ...sub, name: subcategoryName } : sub
          );
          await putRequest(endpoints.categories.category(trackerId, selectedCategory.id), {
            name: selectedCategory.name,
            subcategories: updatedSubcategories,
          });
          setSnackbar({
            open: true,
            message: 'Subcategory updated successfully',
            severity: 'success',
          });
        }
        loadCategories();
      } catch (error) {
        console.error('Error saving subcategory:', error);
        setSnackbar({ open: true, message: 'Failed to save subcategory', severity: 'error' });
      }
    }

    setOpenDialog(false);
    setCategoryName('');
    setSubcategoryName('');
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
            Manage Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            Add Category
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your expense categories and subcategories. Categories help organize your spending.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#10b981' }} />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info">
            No categories found. Add your first category to get started.
          </Alert>
        ) : (
          <List>
            {categories.map((category, index) => (
              <React.Fragment key={category.id}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => toggleCategory(category.id)}
                    sx={{ mr: 1 }}
                  >
                    {expandedCategories.has(category.id) ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                  <FolderIcon sx={{ mr: 2, color: '#10b981' }} />
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontSize: '1em', fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                    }
                    secondary={`${category.subcategories.length} subcategories`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => handleAddSubcategory(category)}
                      sx={{ mr: 0.5, color: '#10b981' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCategory(category)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>

                <Collapse in={expandedCategories.has(category.id)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 4 }}>
                    {category.subcategories.map(subcategory => (
                      <ListItem
                        key={subcategory.id}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          backgroundColor: 'rgba(16, 185, 129, 0.02)',
                          '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.05)' },
                        }}
                      >
                        <SubdirectoryArrowRightIcon
                          sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }}
                        />
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {subcategory.name}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleEditSubcategory(category, subcategory)}
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSubcategory(category, subcategory)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>

                {index < categories.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add' : 'Edit'}{' '}
          {dialogType === 'category' ? 'Category' : 'Subcategory'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={dialogType === 'category' ? 'Category Name' : 'Subcategory Name'}
            type="text"
            fullWidth
            variant="outlined"
            value={dialogType === 'category' ? categoryName : subcategoryName}
            onChange={e =>
              dialogType === 'category'
                ? setCategoryName(e.target.value)
                : setSubcategoryName(e.target.value)
            }
            sx={{ mt: 2 }}
          />
          {dialogType === 'subcategory' && selectedCategory && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Adding subcategory to: <strong>{selectedCategory.name}</strong>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDialog} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategorySettings;
