import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Grid,
  Paper,
  Table,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  DialogTitle,
  TableContainer,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

function createData(id: number, title: string, description: string, status: string) {
  return { id, title, description, status };
}

export function TaskListView({ title = 'List' }: Props) {
  const [rows, setRows] = useState<Array<Task>>([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [valueTitle, setValueTitle] = useState('');
  const [valueDescription, setValueDescripton] = useState('');
  const [valueStatus, setValueStatus] = useState('');
  const [valId, setValId] = useState(0);
  const formAddTitle = 'Add Task';
  const formUpdateTitle = 'Update Task';
  const [formTitle, setFormTitle] = useState(formAddTitle);

  const getTasksFromAPI = async () => {
    const tasksApiRes = await axios.get(endpoints.tasks);
    setRows(tasksApiRes?.data || []);
  };

  const handleSubmitForm = async () => {
    console.log({ valId });
    if (valId) await putTaskToAPI();
    else await postTaskToAPI();
    await getTasksFromAPI();
    setOpenFormModal(false);
  };

  const handleSubmitDelete = async () => {
    const tasksApiRes = await axios.delete(`${endpoints.tasks}/${valId}`);
    console.log({ tasksApiRes });
    await getTasksFromAPI();
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id: number) => {
    setValId(id);
    setOpenDeleteModal(true);
  };

  const postTaskToAPI = async () => {
    const tasksApiRes = await axios.post(endpoints.tasks, {
      title: valueTitle,
      description: valueDescription,
      status: valueStatus,
    });

    console.log({ tasksApiRes });
  };

  const putTaskToAPI = async () => {
    const tasksApiRes = await axios.put(`${endpoints.tasks}/${valId}`, {
      title: valueTitle,
      description: valueDescription,
      status: valueStatus,
    });

    console.log({ tasksApiRes });
  };

  useEffect(() => {
    getTasksFromAPI();
  }, []);

  const handleOpenFormModal = (paramTitle: string, data?: Task) => {
    setFormTitle(paramTitle);
    setOpenFormModal(true);
    setValueTitle(data?.title || '');
    setValueDescripton(data?.description || '');
    setValueStatus(data?.status || '');
    setValId(data?.id || 0);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box sx={{ mt: 2 }}>
        <Button variant="soft" color="primary" onClick={() => handleOpenFormModal(formAddTitle)}>
          Add Task
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      color="info"
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenFormModal(formUpdateTitle, row)}
                    >
                      Update
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleOpenDeleteModal(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openFormModal}
        fullWidth
        onClose={() => setOpenFormModal(false)}
        sx={{ mb: 28 }}
      >
        <DialogTitle>{formTitle}</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Title</Typography>
            <TextField
              placeholder="Title"
              value={valueTitle}
              fullWidth
              onChange={(e: any) => setValueTitle(e.target.value)}
            />
          </Box>
          <Grid sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Description</Typography>
            <TextField
              placeholder="Description"
              value={valueDescription}
              fullWidth
              onChange={(e: any) => setValueDescripton(e.target.value)}
            />
          </Grid>
          <Grid sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Status</Typography>
            <TextField
              placeholder="Status"
              value={valueStatus}
              fullWidth
              onChange={(e: any) => setValueStatus(e.target.value)}
            />
          </Grid>
          <Grid sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ fontSize: 16 }}
              size="medium"
              onClick={() => setOpenFormModal(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1, fontSize: 16 }}
              size="medium"
              onClick={handleSubmitForm}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        fullWidth
        onClose={() => setOpenDeleteModal(false)}
        sx={{ mb: 28 }}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography>Are you sure to delete this task?</Typography>
          <Grid sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ fontSize: 16 }}
              size="medium"
              onClick={() => setOpenDeleteModal(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 1, fontSize: 16 }}
              size="medium"
              onClick={handleSubmitDelete}
            >
              Delete
            </Button>
          </Grid>
        </Box>
      </Dialog>
    </DashboardContent>
  );
}
